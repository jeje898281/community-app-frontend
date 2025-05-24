import React, { useState } from 'react';
import QrScanner from './QrScanner';
import '../styles/ScanPage.css'; // 引入外部樣式

function ScanPage() {
  const [lastScan, setLastScan] = useState('');
  const [error, setError] = useState(null);

  const handleScanSuccess = (cleanText) => {
    console.log('掃描成功:', cleanText);
    setLastScan(cleanText);
    setError(null);
  };

  const handleScanError = (errorMessage) => {
    console.error('掃描失敗:', errorMessage);
    setError('無法辨識 QR Code，請再試一次。');
    setLastScan('');
  };

  return (
    <div className="scan-page">
      <h2 className="page-title">QR Code 掃描頁</h2>
      <p className="page-description">請將 QR Code 對準掃描區域。</p>

      <div className="scanner-container">
        <QrScanner onScanSuccess={handleScanSuccess} onError={handleScanError} />
      </div>

      <div className="result-container">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <p className="scan-result">掃到的結果：{lastScan || '尚未掃描'}</p>
        )}
      </div>
    </div>
  );
}

export default ScanPage;
