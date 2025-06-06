// src/pages/auth/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/api';
import Toast from '../../components/Toast';
import '../../styles/ProfilePage.css';

export default function ProfilePage() {
  const { username, displayName, communityName, communityDescription, role, login } = useAuth();
  const [profile, setProfile] = useState({
    id: '',
    username: '',
    displayName: '',
    role: '',
    createdAt: '',
    updatedAt: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(displayName || '');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // 載入個人資料
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        setEditDisplayName(profileData.displayName);
      } else {
        showToast('載入個人資料失敗', 'error');
      }
    } catch (error) {
      console.error('載入個人資料失敗:', error);
      showToast(error.response?.data?.message || '載入個人資料失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': '系統管理員',
      'manager': '社區管理員',
      'meeting_assistant': '會議助理',
      'resident': '一般住戶',
      'user': '一般用戶'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const roleClassMap = {
      'admin': 'badge-error',
      'manager': 'badge-warning',
      'meeting_assistant': 'badge-info',
      'resident': 'badge-success',
      'user': 'badge-primary'
    };
    return roleClassMap[role] || 'badge-primary';
  };

  const handleSaveProfile = async () => {
    if (!editDisplayName.trim()) {
      showToast('顯示名稱不能為空', 'error');
      return;
    }

    if (editDisplayName.trim().length > 50) {
      showToast('顯示名稱長度不能超過50個字元', 'error');
      return;
    }

    try {
      setUpdating(true);
      const response = await updateProfile({ displayName: editDisplayName.trim() });

      if (response.data.success) {
        const updatedProfile = response.data.data;
        setProfile(updatedProfile);
        setIsEditing(false);
        showToast(response.data.message || '資料更新成功', 'success');

        // 更新Context中的displayName
        const currentUserData = {
          token: localStorage.getItem('token'),
          username: localStorage.getItem('username'),
          displayName: updatedProfile.displayName,
          community: {
            name: localStorage.getItem('communityName'),
            description: localStorage.getItem('communityDescription')
          },
          role: localStorage.getItem('role')
        };
        login(currentUserData);
      } else {
        showToast(response.data.message || '更新失敗', 'error');
      }
    } catch (error) {
      console.error('更新個人資料失敗:', error);
      showToast(error.response?.data?.message || '更新失敗，請稍後再試', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDisplayName(profile.displayName || displayName);
    setIsEditing(false);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-TW');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>載入個人資料中...</p>
          </div>
        </div>
      </div>
    );
  }

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
                disabled={updating}
              >
                {isEditing ? '取消' : '編輯'}
              </button>
            </div>

            <div className="card-body">
              <div className="profile-grid">
                <div className="profile-item">
                  <label className="profile-label">
                    用戶ID
                  </label>
                  <div className="profile-value">
                    <span className="value-text">{profile.id || '-'}</span>
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    帳號
                  </label>
                  <div className="profile-value">
                    <span className="value-text">{profile.username || username || '-'}</span>
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
                        maxLength={50}
                        disabled={updating}
                      />
                    ) : (
                      <span className="value-text">{profile.displayName || displayName || '-'}</span>
                    )}
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    用戶角色
                  </label>
                  <div className="profile-value">
                    <span className={`badge ${getRoleBadgeClass(profile.role || role)}`}>
                      {getRoleDisplayName(profile.role || role)}
                    </span>
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    註冊時間
                  </label>
                  <div className="profile-value">
                    <span className="value-text">{formatDateTime(profile.createdAt)}</span>
                  </div>
                </div>

                <div className="profile-item">
                  <label className="profile-label">
                    最後更新
                  </label>
                  <div className="profile-value">
                    <span className="value-text">{formatDateTime(profile.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="profile-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                    disabled={updating}
                  >
                    {updating ? '儲存中...' : '儲存變更'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={updating}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 社區資訊卡片 */}
          {(communityName || communityDescription) && (
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
                    <span className="community-value">{communityName || '-'}</span>
                  </div>
                  {communityDescription && (
                    <div className="community-item">
                      <label className="community-label">社區描述</label>
                      <p className="community-description">{communityDescription}</p>
                    </div>
                  )}
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
                <button className="action-button" disabled>
                  <span className="action-text">修改密碼</span>
                  <span className="action-arrow">→</span>
                </button>
                <button className="action-button" disabled>
                  <span className="action-text">活動記錄</span>
                  <span className="action-arrow">→</span>
                </button>
              </div>
              <p className="action-note">這些功能即將開放</p>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}
    </div>
  );
}
