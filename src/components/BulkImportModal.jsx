import React, { useState } from 'react';
import { bulkImportResidents } from '../services/api';
import Toast from './Toast';
import '../styles/BulkImportModal.css';

function BulkImportModal({ isOpen, onClose, onSuccess }) {
    const [csvFile, setCsvFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: 選擇檔案, 2: 預覽資料, 3: 匯入結果
    const [error, setError] = useState('');
    const [importResult, setImportResult] = useState(null);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    // 下載CSV模板
    const downloadTemplate = () => {
        const csvContent = [
            ['戶號', '坪數', '電子信箱'],
            ['A101', '33.5', 'a101@example.com'],
            ['B202', '28.8', 'b202@example.com'],
            ['C303', '45.2', '']
        ];

        const csvString = csvContent.map(row =>
            row.map(field => `"${field}"`).join(',')
        ).join('\n');

        const blob = new Blob(['\uFEFF' + csvString], {
            type: 'text/csv;charset=utf-8;'
        });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', '住戶匯入模板.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 解析CSV檔案
    const parseCSV = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) { // 跳過表頭
            const line = lines[i].trim();
            if (!line) continue;

            // 簡單的CSV解析（支援引號包圍的欄位）
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (matches && matches.length >= 2) {
                const code = matches[0]?.replace(/"/g, '').trim();
                const residentSqm = matches[1]?.replace(/"/g, '').trim();
                const email = matches[2]?.replace(/"/g, '').trim() || '';

                result.push({
                    code,
                    residentSqm: parseFloat(residentSqm),
                    email: email || undefined
                });
            }
        }

        return result;
    };

    // 處理檔案上傳
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('請選擇 CSV 格式的檔案');
            return;
        }

        setCsvFile(file);
        setError('');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const data = parseCSV(text);
                setCsvData(data);

                // 生成預覽資料（最多顯示前10筆）
                setPreviewData(data.slice(0, 10));
                setStep(2);
            } catch (err) {
                setError('檔案格式錯誤，請檢查CSV格式');
                console.error('CSV parsing error:', err);
            }
        };
        reader.readAsText(file, 'UTF-8');
    };

    // 驗證資料
    const validateData = (data) => {
        const errors = [];

        data.forEach((row, index) => {
            if (!row.code || row.code.trim() === '') {
                errors.push(`第 ${index + 2} 行：戶號不能為空`);
            }
            if (!row.residentSqm || isNaN(row.residentSqm) || row.residentSqm <= 0) {
                errors.push(`第 ${index + 2} 行：坪數格式錯誤`);
            }
            if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
                errors.push(`第 ${index + 2} 行：電子信箱格式錯誤`);
            }
        });

        return errors;
    };

    // 執行匯入
    const handleImport = async () => {
        const validationErrors = validateData(csvData);
        if (validationErrors.length > 0) {
            setError(validationErrors.join('\n'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await bulkImportResidents({ residents: csvData });
            setImportResult(response.data);
            setStep(3);

            if (response.data.success) {
                showToast(`成功匯入 ${response.data.importedCount} 筆住戶資料`, 'success');
                onSuccess();
            } else {
                showToast('匯入完成，但有部分資料未成功', 'warning');
            }
        } catch (err) {
            console.error('Import error:', err);
            setError(err.response?.data?.message || '匯入失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    const handleClose = () => {
        if (!loading) {
            setCsvFile(null);
            setCsvData([]);
            setPreviewData([]);
            setStep(1);
            setError('');
            setImportResult(null);
            onClose();
        }
    };

    const resetToStep1 = () => {
        setCsvFile(null);
        setCsvData([]);
        setPreviewData([]);
        setStep(1);
        setError('');
        setImportResult(null);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={handleClose}>
                <div className="modal-content bulk-import-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">批量匯入住戶</h2>
                        <button
                            className="modal-close-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="modal-body">
                        {step === 1 && (
                            <div className="step-content">
                                <div className="instruction-section">
                                    <h3>📋 匯入說明</h3>
                                    <ul className="instruction-list">
                                        <li><strong>戶號</strong>：住戶的唯一識別碼（必填）</li>
                                        <li><strong>坪數</strong>：住戶的坪數，支援小數點（必填）</li>
                                        <li><strong>電子信箱</strong>：住戶的聯絡信箱（選填）</li>
                                    </ul>

                                    <div className="template-section">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={downloadTemplate}
                                        >
                                            📥 下載CSV模板
                                        </button>
                                        <p className="template-hint">
                                            建議先下載模板，按照格式填寫資料後再上傳
                                        </p>
                                    </div>
                                </div>

                                <div className="upload-section">
                                    <h3>📁 選擇檔案</h3>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="file-input"
                                        disabled={loading}
                                    />
                                    <p className="file-hint">請選擇 CSV 格式的檔案</p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <div className="preview-header">
                                    <h3>👀 資料預覽</h3>
                                    <p>共 {csvData.length} 筆資料，以下顯示前 {Math.min(csvData.length, 10)} 筆：</p>
                                </div>

                                <div className="preview-table-container">
                                    <table className="preview-table">
                                        <thead>
                                            <tr>
                                                <th>戶號</th>
                                                <th>坪數</th>
                                                <th>電子信箱</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.code}</td>
                                                    <td>{row.residentSqm}</td>
                                                    <td>{row.email || '（無）'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {csvData.length > 10 && (
                                    <p className="more-data-hint">
                                        ... 還有 {csvData.length - 10} 筆資料
                                    </p>
                                )}
                            </div>
                        )}

                        {step === 3 && importResult && (
                            <div className="step-content">
                                <div className="result-section">
                                    <h3>📊 匯入結果</h3>

                                    {importResult.success ? (
                                        <div className="success-result">
                                            <div className="result-icon">✅</div>
                                            <p>成功匯入 <strong>{importResult.importedCount}</strong> 筆住戶資料</p>
                                        </div>
                                    ) : (
                                        <div className="partial-result">
                                            <div className="result-icon">⚠️</div>
                                            <p>{importResult.message}</p>

                                            {importResult.conflictedCodes && (
                                                <div className="conflict-section">
                                                    <h4>重複的戶號：</h4>
                                                    <div className="conflict-codes">
                                                        {importResult.conflictedCodes.map((code, index) => (
                                                            <span key={index} className="conflict-code">{code}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {importResult.invalidRows && (
                                                <div className="invalid-section">
                                                    <h4>格式錯誤的資料：</h4>
                                                    <div className="invalid-rows">
                                                        {importResult.invalidRows.map((row, index) => (
                                                            <div key={index} className="invalid-row">
                                                                第 {row.index} 行：{row.errors.join('、')}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                <pre>{error}</pre>
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        {step === 1 && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                取消
                            </button>
                        )}

                        {step === 2 && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetToStep1}
                                    disabled={loading}
                                >
                                    重新選擇
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleImport}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            匯入中...
                                        </>
                                    ) : (
                                        `確認匯入 ${csvData.length} 筆資料`
                                    )}
                                </button>
                            </>
                        )}

                        {step === 3 && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleClose}
                            >
                                完成
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
                duration={3000}
            />
        </>
    );
}

export default BulkImportModal; 