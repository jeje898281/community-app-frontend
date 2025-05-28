//src/pages/meetings/ScanPage.jsx
import React, { useState, useEffect } from 'react';
import QrScanner from '../../components/QrScanner';
import '../../styles/ScanPage.css';
import { useMeeting } from '../../contexts/MeetingContext';
import { useNavigate } from 'react-router-dom';

function ScanPage() {
  const [lastScan, setLastScan] = useState('');
  const [error, setError] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { meeting } = useMeeting();
  const navigate = useNavigate();
  const meetingId = meeting?.id;

  const handleScanSuccess = async (cleanText) => {
    if (isProcessing) return; // 防止重複處理

    setIsProcessing(true);
    console.log('掃描成功:', cleanText);
    setLastScan(cleanText);
    setError(null);
    setSuccessCount(prev => prev + 1);

    // 模擬 API 處理時間
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);

    // 可以添加更多處理邏輯，比如驗證QR Code內容
    if (cleanText && cleanText.length > 0) {
      // 顯示成功提示
      showSuccessAnimation();
    }
  };

  const handleScanError = (errorMessage) => {
    console.error('掃描失敗:', errorMessage);
    setError('無法辨識 QR Code，請確保光線充足並對準掃描區域');
    setLastScan('');
    setIsProcessing(false);
  };

  const showSuccessAnimation = () => {
    // 添加成功動畫類
    const container = document.querySelector('.scan-container');
    container?.classList.add('scan-success');
    setTimeout(() => {
      container?.classList.remove('scan-success');
    }, 2000);
  };

  return (
    <div className="scan-page">
      <div className="scan-container">
        <div className="scanner-wrapper">
          <div className="scanner-frame">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>

            <QrScanner
              onScanSuccess={handleScanSuccess}
              onError={handleScanError}
            />

            {isProcessing && (
              <div className="processing-overlay">
                <div className="processing-spinner"></div>
                <p>處理中...</p>
              </div>
            )}
          </div>
        </div>

        <div className="result-section">
          {error ? (
            <div className="result-card error-card">
              <div className="result-icon">⚠️</div>
              <h3>掃描失敗</h3>
              <p className="error-message">{error}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => setError(null)}>
                重新嘗試
              </button>
            </div>
          ) : lastScan ? (
            <div className="result-card success-card">
              <div className="result-icon">✅</div>
              <h3>掃描成功</h3>
              <div className="scan-result">
                <p className="result-label">掃描結果：</p>
                <p className="result-value">{lastScan}</p>
              </div>
              <div className="result-actions">
                <button className="btn btn-success btn-sm">
                  確認簽到
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setLastScan('')}
                >
                  重新掃描
                </button>
              </div>
            </div>
          ) : (
            <div className="result-card waiting-card">
              <div className="result-icon">🔍</div>
              <h3>等待掃描</h3>
              <p>請對準 QR Code 進行掃描</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScanPage;
