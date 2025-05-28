// src/pages/auth/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/ProfilePage.css';

export default function ProfilePage() {
  const { username, displayName, communityName, communityDescription, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(displayName);
  const [editCommunityName, setEditCommunityName] = useState(communityName);

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': '系統管理員',
      'manager': '社區管理員',
      'resident': '一般住戶',
      'user': '一般用戶'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const roleClassMap = {
      'admin': 'badge-error',
      'manager': 'badge-warning',
      'resident': 'badge-success',
      'user': 'badge-primary'
    };
    return roleClassMap[role] || 'badge-primary';
  };

  const handleSaveProfile = () => {
    // TODO: 實作更新個人資料的API呼叫
    console.log('更新個人資料:', {
      displayName: editDisplayName,
      communityName: editCommunityName
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditDisplayName(displayName);
    setEditCommunityName(communityName);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-content">
            <h1 className="page-title">
              個人資料
            </h1>
            <p className="page-subtitle">管理您的帳戶資訊</p>
          </div>
        </div>

        <div className="profile-content">
          {/* 個人資訊卡片 */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                基本資訊
              </h2>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '取消' : '編輯'}
              </button>
            </div>

            <div className="card-body">
              <div className="profile-grid">
                <div className="profile-item">
                  <label className="profile-label">
                    帳號
                  </label>
                  <div className="profile-value">
                    <span className="value-text">{username || '-'}</span>
                    <span className="value-badge badge badge-primary">不可修改</span>
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    顯示名稱
                  </label>
                  <div className="profile-value">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        className="form-input"
                        placeholder="請輸入顯示名稱"
                      />
                    ) : (
                      <span className="value-text">{displayName || '-'}</span>
                    )}
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    所屬社區
                  </label>
                  <div className="profile-value">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editCommunityName}
                        onChange={(e) => setEditCommunityName(e.target.value)}
                        className="form-input"
                        placeholder="請輸入社區名稱"
                      />
                    ) : (
                      <span className="value-text">{communityName || '-'}</span>
                    )}
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    用戶角色
                  </label>
                  <div className="profile-value">
                    <span className={`badge ${getRoleBadgeClass(role)}`}>
                      {getRoleDisplayName(role)}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="profile-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                  >
                    儲存變更
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 社區資訊卡片 */}
          {communityDescription && (
            <div className="community-card">
              <div className="card-header">
                <h2 className="card-title">
                  社區資訊
                </h2>
              </div>
              <div className="card-body">
                <div className="community-info">
                  <div className="community-item">
                    <label className="community-label">社區名稱</label>
                    <span className="community-value">{communityName}</span>
                  </div>
                  <div className="community-item">
                    <label className="community-label">社區描述</label>
                    <p className="community-description">{communityDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 快速操作卡片 */}
          <div className="actions-card">
            <div className="card-header">
              <h2 className="card-title">
                快速操作
              </h2>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <button className="action-button">
                  <span className="action-text">修改密碼</span>
                  <span className="action-arrow">→</span>
                </button>
                <button className="action-button">
                  <span className="action-text">活動記錄</span>
                  <span className="action-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
