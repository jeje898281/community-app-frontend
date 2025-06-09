import React, { useState, useEffect } from 'react';
import { updateResident } from '../services/api';
import { getErrorMessage } from '../constants/errorCodes';
import '../styles/EditResidentModal.css';

function EditResidentModal({ isOpen, onClose, onSuccess, resident }) {
    const [formData, setFormData] = useState({
        code: '',
        residentSqm: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (resident) {
            setFormData({
                code: resident.code || '',
                residentSqm: resident.residentSqm || '',
                email: resident.email || ''
            });
            // 清除之前的錯誤
            setErrors({});
        }
    }, [resident]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = '請輸入住戶編號';
        }

        if (!formData.residentSqm || formData.residentSqm <= 0) {
            newErrors.residentSqm = '請輸入有效的坪數';
        } else {
            const sqmValue = parseFloat(formData.residentSqm);
            if (isNaN(sqmValue) || sqmValue <= 0) {
                newErrors.residentSqm = '請輸入有效的坪數';
            } else if (formData.residentSqm.toString().includes('.')) {
                const decimalPart = formData.residentSqm.toString().split('.')[1];
                if (decimalPart && decimalPart.length > 2) {
                    newErrors.residentSqm = '坪數最多只能輸入到小數點後兩位';
                }
            }
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '請輸入有效的電子信箱格式';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const updateData = {
                code: formData.code.trim(),
                residentSqm: parseFloat(Number(formData.residentSqm).toFixed(2)),
                email: formData.email.trim() || null
            };

            console.log('提交更新數據:', updateData); // Debug log

            await updateResident(resident.id, updateData);

            onSuccess();
            onClose();
            setErrors({});
        } catch (error) {
            console.error('Edit resident failed:', error);

            // 使用錯誤代碼常數來獲取準確的錯誤訊息
            const errorCode = error.response?.data?.code;
            const errorMessage = getErrorMessage(errorCode) || error.response?.data?.message || '編輯失敗，請稍後再試';

            if (errorCode === 'CODE_ALREADY_EXISTS' || errorCode === 'RESIDENT_CODE_ALREADY_EXISTS') {
                setErrors({ code: errorMessage });
            } else {
                setErrors({ general: errorMessage });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setErrors({});
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        <span className="modal-icon">✏️</span>
                        編輯住戶資料
                    </h2>
                    <button
                        className="modal-close-btn"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        ✖️
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="code" className="form-label">
                            住戶編號 <span className="required">*</span>
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={formData.code}
                            onChange={(e) => {
                                setFormData({ ...formData, code: e.target.value });
                                // 清除戶號錯誤
                                if (errors.code) {
                                    setErrors({ ...errors, code: null });
                                }
                            }}
                            className={`form-input ${errors.code ? 'error' : ''}`}
                            placeholder="例如：A101"
                            disabled={isSubmitting}
                        />
                        {errors.code && <span className="error-message">{errors.code}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="residentSqm" className="form-label">
                            坪數 <span className="required">*</span>
                        </label>
                        <input
                            id="residentSqm"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.residentSqm}
                            onChange={(e) => {
                                let value = e.target.value;
                                // 限制小數點後最多兩位
                                if (value.includes('.')) {
                                    const parts = value.split('.');
                                    if (parts[1] && parts[1].length > 2) {
                                        value = parts[0] + '.' + parts[1].substring(0, 2);
                                    }
                                }
                                setFormData({ ...formData, residentSqm: value });
                                // 清除坪數錯誤
                                if (errors.residentSqm) {
                                    setErrors({ ...errors, residentSqm: null });
                                }
                            }}
                            className={`form-input ${errors.residentSqm ? 'error' : ''}`}
                            placeholder="例如：30.25"
                            disabled={isSubmitting}
                        />
                        {errors.residentSqm && <span className="error-message">{errors.residentSqm}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            電子信箱
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                // 保持原始大小寫，不做任何轉換
                                setFormData({ ...formData, email: e.target.value });
                                // 清除信箱錯誤
                                if (errors.email) {
                                    setErrors({ ...errors, email: null });
                                }
                            }}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="例如：Resident@Example.com"
                            disabled={isSubmitting}
                            style={{ textTransform: 'none' }} // 確保不會自動轉換大小寫
                            autoCapitalize="none"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                        <div className="form-hint">信箱將保持您輸入的大小寫格式</div>
                    </div>

                    {errors.general && (
                        <div className="error-alert">
                            <span className="error-icon">⚠️</span>
                            {errors.general}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    更新中...
                                </>
                            ) : (
                                '確認更新'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditResidentModal; 