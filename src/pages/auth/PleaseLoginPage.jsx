import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/PleaseLoginPage.css';

function PleaseLoginPage() {
    const location = useLocation();
    const intendedPath = location.state?.from || '/';

    return (
        <div className="please-login-page">
            <div className="login-prompt">
                <div className="prompt-content">
                    <h1>需要登入才能使用此功能</h1>
                    <p>請先登入您的帳號以繼續使用社區管理平台的完整功能。</p>
                    <div className="action-buttons">
                        <Link to="/login" state={{ from: intendedPath }} className="btn-primary">
                            前往登入
                        </Link>
                        <Link to="/" className="btn-secondary">
                            返回首頁
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PleaseLoginPage; 