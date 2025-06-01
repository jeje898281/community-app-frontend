// src/services/api.js
import axios from 'axios';

// 創建 Axios 實例
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

// 從 localStorage 讀取 JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function listResidents() {
  return apiClient.get('/api/resident');
}

export function scanAttendance(qrCode) {
  return apiClient.post('/api/meeting/checkin', { qrCode });
}

export function login({ username, password }) {
  return apiClient.post('/api/auth/login', { username, password });
}

export function manualCheckIn({ meetingId, residentId }) {
  return apiClient.post('/api/meeting/checkin', {
    meetingId,
    residentId,
    isManual: true
  });
}
export function getAttendanceSummary(meetingId) {
  return apiClient.get(`/api/meeting/summary/${meetingId}`);
}

export function listMeetings() {
  return apiClient.get('/api/meeting');
}

export function getMeetingById(meetingId) {
  return apiClient.get(`/api/meeting/${meetingId}`);
}

// 生成住戶QR碼
export function generateQRCodes(meetingId) {
  return apiClient.post('/api/meeting/generate-qr-codes', { meetingId });
}

// 新增住戶
export function createResident(data) {
  return apiClient.post('/api/resident', data);
}

// 批量匯入住戶
export function bulkImportResidents(data) {
  return apiClient.post('/api/resident/bulk', data);
}



