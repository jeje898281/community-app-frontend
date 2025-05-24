// src/services/api.js
import axios from 'axios';

// 創建 Axios 實例
const apiClient = axios.create({
  baseURL: 'https://api.example.com', // 替換為真實的 API 根路徑
  timeout: 10000,
});

export function scanAttendance(unit) {
  return apiClient.post('/api/attendance/scan', { unit });
}

// 出席統計的 API 請求
export const getAttendanceSummary = () => {
  return apiClient.get('/attendance/summary'); // 替換為真實的 API 路徑
};
