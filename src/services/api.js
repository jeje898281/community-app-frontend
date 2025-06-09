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

export function manualCheckIn({ meetingId, residentCode }) {
  return apiClient.post('/api/meeting/checkin', {
    meetingId,
    residentCode,
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

// 編輯住戶
export function updateResident(id, data) {
  return apiClient.patch('/api/resident', { id, ...data });
}

// 刪除住戶
export function deleteResident(id) {
  return apiClient.delete('/api/resident', { data: { id } });
}

// 更新會議
export function updateMeeting(data) {
  return apiClient.patch('/api/meeting', data);
}

// 新增會議
export function createMeeting(data) {
  return apiClient.post('/api/meeting', data);
}

// === 個人資料相關API ===
// 獲取個人資料
export function getProfile() {
  return apiClient.get('/api/profile');
}

// 更新個人資料
export function updateProfile(data) {
  return apiClient.put('/api/profile', data);
}

// 修改密碼
export function changePassword(data) {
  return apiClient.put('/api/profile/password', data);
}

// === 社區資訊相關API ===
// 獲取社區資訊
export function getCommunityInfo() {
  return apiClient.get('/api/community');
}

// 更新社區資訊
export function updateCommunityInfo(data) {
  return apiClient.put('/api/community', data);
}



