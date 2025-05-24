//index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
// Layout + NavBar
import Layout from './components/Layout';

// 各個頁面 
import HomePage from './components/HomePage';
import ScanPage from './components/ScanPage';
import ManualCheckIn from './components/ManualCheckIn';
import Summary from './components/Summary';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* 主要路由：path="/" 使用 Layout */}
        <Route path="/" element={<Layout />}>
          {/* index 表示當網址正好是"/"時，就顯示 HomePage */}
          <Route index element={<HomePage />} />

          {/* /scan -> ScanPage */}
          <Route path="scan" element={<ScanPage />} />

          {/* /manual -> ManualCheckIn */}
          <Route path="manual" element={<ManualCheckIn />} />

          {/* /summary -> Summary */}
          <Route path="summary" element={<Summary />} />
        </Route>
      </Routes>
    </Router>
    <reportWebVitals />
  </React.StrictMode>
);

reportWebVitals();
