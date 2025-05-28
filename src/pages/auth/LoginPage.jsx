// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('請輸入帳號和密碼');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiLogin({ username, password });

      const { token, displayName, community, role, username: user } = res.data;
      login({
        token,
        username: user,
        displayName,
        community,
        role
      });

      navigate('/', { replace: true });
    } catch (err) {
      console.error('登入失敗:', err);
      setError('登入失敗，請檢查帳號密碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 背景裝飾 */}
        <div className="login-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>

        {/* 登錄卡片 */}
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🏘️</span>
              <h1>社區管理平台</h1>
            </div>
            <p className="login-subtitle">歡迎回來，請登入您的帳戶</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <span className="label-icon">👤</span>
                帳號
              </label>
              <input
                id="username"
                type="text"
                placeholder="請輸入您的帳號"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                密碼
              </label>
              <input
                id="password"
                type="password"
                placeholder="請輸入您的密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  登入中...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  登入
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="help-text">
              <span className="help-icon">💡</span>
              如有問題請聯繫系統管理員
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
