import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css'; // 外部 CSS

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制漢堡選單展開
  const location = useLocation(); // React Router 的 Hook，用於取得當前路由
  const navRef = useRef(null); // 用於監測點擊是否發生在 NavBar 內

  // 切換選單展開狀態
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 點擊外部時關閉選單
  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsMenuOpen(false); // 如果點擊的地方不在 NavBar，關閉選單
    }
  };

  // 添加和移除全局點擊事件監聽器
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // 清理事件監聽器
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">麗寶國際館</Link>

        {/* 漢堡選單按鈕 (手機版顯示) */}
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>

        {/* 導覽連結 (手機版根據 isMenuOpen 顯示隱藏) */}
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">首頁</Link>
          </li>
          <li className={location.pathname === '/scan' ? 'active' : ''}>
            <Link to="/scan">掃描頁</Link>
          </li>
          <li className={location.pathname === '/manual' ? 'active' : ''}>
            <Link to="/manual">手動輸入</Link>
          </li>
          <li className={location.pathname === '/summary' ? 'active' : ''}>
            <Link to="/summary">查看結果</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
