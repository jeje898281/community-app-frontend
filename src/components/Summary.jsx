import React, { useEffect, useState } from 'react';
import { getAttendanceSummary } from '../services/api';
import '../styles/Summary.css';

function Summary() {
  // 初始化假資料
  const [summary, setSummary] = useState({
    attendedUnits: 0,
    totalUnits: 0,
    attendedArea: 0,
    totalArea: 0,
    isThresholdReached: false,
  });
  const [loading, setLoading] = useState(true); // 是否正在載入
  const [error, setError] = useState(null);     // 儲存錯誤訊息

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getAttendanceSummary();
        setSummary(response.data); // API 成功時更新真實數據
        setError(null);            // 清除錯誤
      } catch (err) {
        console.error('取得統計失敗:', err);
        setError('無法取得統計數據，已顯示預設資料'); // 設定錯誤訊息
      } finally {
        setLoading(false);         // 結束載入
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="container">
      {loading && <p className="stats">載入中...</p>} {/* 載入中效果 */}
      <h2 className="title">出席統計</h2>
      <p className="stats">已出席戶數: {summary.attendedUnits}</p>
      <p className="stats">總戶數: {summary.totalUnits}</p>
      <p className="stats">已出席坪數: {summary.attendedArea}</p>
      <p className="stats">總坪數: {summary.totalArea}</p>
      <p
        className={`stats threshold ${summary.isThresholdReached ? 'threshold-reached' : 'threshold-not-reached'}`}
      >
        是否達到門檻: {summary.isThresholdReached ? '達到' : '未達到'}
      </p>
      {error && <p className="error">{error}</p>} {/* 錯誤訊息附加顯示 */}
    </div>
  );
}

export default Summary;
