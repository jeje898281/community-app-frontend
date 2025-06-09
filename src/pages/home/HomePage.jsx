//src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css';
import logo from '../../assets/join.svg';
import { useAuth } from '../../contexts/AuthContext';

function HomePage() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="homepage">
      <header className="hero-section">
        <div className="hero-content">
          <h1>歡迎來到社區管理平台</h1>
          <p>簡化社區管理流程，提升效率與透明度。</p>
          <Link to={isLoggedIn ? "/meetings" : "/login"} className="btn-primary">
            {isLoggedIn ? "前往會議管理" : "前往登入"}
          </Link>
        </div>
        <div className="hero-image">
          <img src={logo} alt="社區管理平台" />
        </div>
      </header>

      <section className="features-section">
        <h2>我們提供的功能</h2>
        <div className="features">
          <div className="feature">
            <h3>快速掃描</h3>
            <p>使用 QR Code 即可快速完成檢測。</p>
            <Link to={isLoggedIn ? "/meetings" : "/login"} className="feature-link">
              {isLoggedIn ? "選擇會議進行掃描" : "登入後使用"}
            </Link>
          </div>
          <div className="feature">
            <h3>手動簽到</h3>
            <p>無需擔心設備問題，支援手動記錄。</p>
            <Link to={isLoggedIn ? "/meetings" : "/login"} className="feature-link">
              {isLoggedIn ? "選擇會議手動簽到" : "登入後使用"}
            </Link>
          </div>
          <div className="feature">
            <h3>統計摘要</h3>
            <p>全面記錄與分析數據，隨時掌握狀況。</p>
            <Link to={isLoggedIn ? "/meetings" : "/login"} className="feature-link">
              {isLoggedIn ? "選擇會議查看統計" : "登入後使用"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
