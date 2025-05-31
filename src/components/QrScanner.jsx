// frontend/src/components/QrScanner.jsx
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QrScanner.css';

function QrScanner({ onScanSuccess, onError }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef(null);
  const lastScannedRef = useRef('');
  const isProcessingRef = useRef(false);

  const handleScanSuccess = useCallback((codeText) => {
    // 檢查是否為重複掃描
    if (codeText === lastScannedRef.current || isProcessingRef.current) {
      return;
    }

    console.log('掃描到QR碼:', codeText);
    lastScannedRef.current = codeText;
    isProcessingRef.current = true;

    // 直接將掃描結果傳給父組件處理
    if (onScanSuccess) {
      onScanSuccess(codeText);
    }

    // 設置冷卻時間，避免重複掃描
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 2000);
  }, [onScanSuccess]);

  const handleScanError = useCallback((error) => {
    // 只記錄真正的錯誤，過濾掉常見的掃描過程錯誤
    if (error &&
      !error.includes('QR code parse error') &&
      !error.includes('No QR code found') &&
      !error.includes('Unable to detect a square') &&
      !error.includes('Couldn\'t find enough corner candidates')) {
      console.error('QR scanner error:', error);
      if (onError) {
        onError('掃描器發生錯誤: ' + error);
      }
    }
  }, [onError]);

  // 清理掃描器
  const cleanupScanner = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        console.log('掃描器已清理');
      } catch (error) {
        console.log('清理掃描器錯誤:', error);
      }
      scannerRef.current = null;
    }
    setIsInitialized(false);
    setScannerReady(false);
  }, []);

  // 初始化掃描器
  const initializeScanner = useCallback(() => {
    cleanupScanner();

    const readerElement = document.getElementById('qr-reader');
    if (!readerElement) {
      console.error('找不到 qr-reader 元素');
      return;
    }

    try {
      console.log('開始初始化掃描器...');

      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: false,
        rememberLastUsedCamera: true,
        disableFlip: false,
        supportedScanTypes: [],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      });

      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          setScannerReady(true);
          handleScanSuccess(decodedText);
        },
        (error) => {
          handleScanError(error);
        }
      );

      setIsInitialized(true);
      console.log('掃描器初始化完成');

    } catch (error) {
      console.error('初始化掃描器失敗:', error);
      if (onError) {
        onError('初始化掃描器失敗: ' + error.message);
      }
    }
  }, [cleanupScanner, handleScanSuccess, handleScanError, onError]);

  // 組件掛載時初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      cleanupScanner();
    };
  }, [initializeScanner, cleanupScanner]);

  // 重新啟動掃描器
  const restartScanner = useCallback(() => {
    console.log('重新啟動掃描器...');
    lastScannedRef.current = '';
    isProcessingRef.current = false;

    setTimeout(() => {
      initializeScanner();
    }, 200);
  }, [initializeScanner]);

  return (
    <div className="qr-scanner-container">
      {/* 掃描框 */}
      <div id="qr-reader" className="qr-reader" />

      {/* 控制按鈕 */}
      <div className="scanner-controls">
        <button
          className="btn btn-secondary btn-sm"
          onClick={restartScanner}
          style={{ marginTop: '10px' }}
        >
          重新啟動掃描器
        </button>

        {!scannerReady && isInitialized && (
          <button
            className="btn btn-primary btn-sm"
            onClick={initializeScanner}
            style={{ marginTop: '10px', marginLeft: '10px' }}
          >
            啟動相機
          </button>
        )}
      </div>

      {/* 掃描狀態提示 */}
      <div className="scanner-status">
        {!isInitialized && (
          <p className="status-text">正在初始化掃描器...</p>
        )}
        {isInitialized && !scannerReady && (
          <p className="status-text">等待相機啟動...</p>
        )}
        {scannerReady && (
          <p className="status-text success">掃描器已就緒，請對準QR碼</p>
        )}
      </div>
    </div>
  );
}

export default QrScanner;
