//src/components/QrScanner.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { scanAttendance } from '../services/api';
import '../styles/QrScanner.css'; // 引入外部樣式

function QrScanner({ onScanSuccess }) {
  const [lastScanned, setLastScanned] = useState('');
  const [scanCooldown, setScanCooldown] = useState(false);

  const handleScanSuccess = useCallback((codeText) => {
    if (scanCooldown || codeText === lastScanned) {
      return; // 3 秒內不允許重複掃描相同的 QR Code
    }

    console.log(`原始掃描的 QR code: ${codeText}`);
    let extractedUrl = '';
    let cleanText = codeText;

    // 解析 MEBKM 格式
    if (codeText.startsWith("MEBKM:")) {
      const urlMatch = codeText.match(/URL:(.*?);/);
      if (urlMatch) {
        extractedUrl = urlMatch[1]; // 取得 URL
      }

      const titleMatch = codeText.match(/TITLE:(.*?);/);
      const title = titleMatch ? titleMatch[1] : '';
      cleanText = extractedUrl || title || codeText;
    }

    console.log('解析後的 QR code:', cleanText);
    setLastScanned(codeText);
    setScanCooldown(true);

    // 3 秒冷卻
    setTimeout(() => setScanCooldown(false), 3000);

    // 如果是 URL，自動打開
    if (extractedUrl) {
      window.open(extractedUrl, '_blank');
    }

    // 發送掃描結果到 API
    scanAttendance(cleanText)
      .then((res) => {
        console.log('報到成功:', res.data);
      })
      .catch((error) => {
        console.error('報到失敗:', error);
      });

    // 呼叫父組件的回調函數
    if (onScanSuccess) {
      onScanSuccess(cleanText);
    }
  }, [lastScanned, scanCooldown, onScanSuccess]);

  // 初始化掃描器
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1.0
    });

    scanner.render(handleScanSuccess, (error) => {
      console.error('QR code parse error, error =', error);
    });

    return () => {
      scanner.clear();
    };
  }, [handleScanSuccess]);

  return (
    <div className="qr-scanner-container">
      {/* 掃描框 */}
      <div id="qr-reader" className="qr-reader" />

      {/* 顯示上一次掃描的結果 */}
      {lastScanned && (
        <p className="scan-result">
          上次掃描結果：<strong>{lastScanned}</strong>
        </p>
      )}
    </div>
  );
}

export default QrScanner;
