// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layouts
// MainLayout 在 src/components/MainLayout.jsx
import MainLayout from './components/MainLayout';
// MeetingLayout 在 src/components/layout/MeetingLayout.jsx
import MeetingLayout from './components/layout/MeetingLayout';

// Pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/auth/ProfilePage';
import CommunityPage from './pages/auth/CommunityPage';
import MeetingListPage from './pages/meetings/MeetingListPage';
import ScanPage from './pages/meetings/ScanPage';
import ManualCheckIn from './pages/meetings/ManualCheckIn';
import SummaryPage from './pages/meetings/SummaryPage';
import ResidentsList from './components/ResidentsList';

// Guards
import RequireAuth from './components/RequireAuth';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>

          {/* 1. 登入頁，不需驗證 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. 受保護路由：必須先登入 */}
          <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
            {/* 2.1 首頁 */}
            <Route index element={<HomePage />} />

            {/* 2.2 住戶清單 */}
            <Route path="residents" element={<ResidentsList />} />
            {/* 個人資料 */}
            <Route path="profile" element={<ProfilePage />} />
            {/* 社區管理 */}
            <Route path="communities" element={<CommunityPage />} />

            {/* 2.3 會議列表 */}
            <Route path="meetings" element={<MeetingListPage />} />
            {/* 2.4 單一會議上下文 */}
            <Route path="meetings/:id" element={<MeetingLayout />}>
              <Route index element={<Navigate to="scan" replace />} />
              <Route path="scan" element={<ScanPage />} />
              <Route path="manual" element={<ManualCheckIn />} />
              <Route path="summary" element={<SummaryPage />} />
            </Route>
          </Route>

          {/* 3. 其他不存在的路由導回首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
