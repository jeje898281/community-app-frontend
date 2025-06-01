import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { isLoggedIn, displayName, communityName, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // 點擊漢堡 / 嘗試開啟下拉選單
  const toggleMenu = () => setIsMenuOpen(open => !open);

  // 點擊外部收起
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar" ref={menuRef}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          {communityName || '社區系統'}
        </Link>

        <ul className="nav-links">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">首頁</Link>
          </li>

          {isLoggedIn && (
            <>
              <li className={location.pathname.startsWith('/meetings') ? 'active' : ''}>
                <Link to="/meetings">進入會議</Link>
              </li>

              {(role === 'admin' || role === 'manager') && (
                <li className={location.pathname === '/residents' ? 'active' : ''}>
                  <Link to="/residents">住戶清單</Link>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="user-section">
          {!isLoggedIn ? (
            <Link to="/login" className="btn-login">登入</Link>
          ) : (
            <div className="user-dropdown">
              <button className="user-btn" onClick={toggleMenu}>
                {displayName}
              </button>
              {isMenuOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      個人資料
                    </Link>
                  </li>
                  {role === 'admin' && (
                    <li className={location.pathname === '/communities' ? 'active' : ''}>
                      <Link to="/communities">社區管理</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      登出
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
