import React, { useState } from 'react';
import { scanAttendance } from '../services/api';
import '../styles/ManualCheckIn.css'; // 引入樣式

function ManualCheckIn() {
  const [unit, setUnit] = useState('');

  const handleCheckIn = () => {
    scanAttendance(unit)
      .then((res) => {
        console.log('報到成功:', res.data);
        alert('報到成功！');
        setUnit('');
      })
      .catch((err) => {
        console.error('報到失敗:', err);
        alert('報到失敗，請檢查輸入資料！');
      });
  };

  return (
    <div className="checkin-container">
      <h2 className="checkin-title">手動報到</h2>
      <p className="checkin-description">請輸入您的戶別代碼，並點擊送出完成報到。</p>

      <div className="input-group">
        <input
          className="checkin-input"
          type="text"
          placeholder="戶別 (Ex: A1-8)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button className="checkin-button" onClick={handleCheckIn}>
          送出
        </button>
      </div>
    </div>
  );
}

export default ManualCheckIn;
