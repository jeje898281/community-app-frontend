// src/pages/auth/CommunityPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/CommunityPage.css';

export default function CommunityPage() {
  const { communityName, communityDescription, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editCommunityName, setEditCommunityName] = useState(communityName);
  const [editCommunityDescription, setEditCommunityDescription] = useState(communityDescription);

  const handleSave = () => {
    // TODO: 實作更新社區資料的API呼叫
    console.log('更新社區資料:', {
      name: editCommunityName,
      description: editCommunityDescription
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCommunityName(communityName);
    setEditCommunityDescription(communityDescription);
    setIsEditing(false);
  };

  // 模擬數據
  const communityStats = {
    totalUnits: 180,
    activeMeetings: 3
  };

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="community-header">
          <div className="header-content">
            <h1 className="page-title">
              社區管理
            </h1>
            <p className="page-subtitle">管理社區資訊與活動</p>
          </div>
          {role === 'admin' && (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '取消編輯' : '編輯資料'}
            </button>
          )}
        </div>

        <div className="community-content">
          {/* 社區資訊卡片 */}
          <div className="community-info-card">
            <div className="card-header">
              <h2 className="card-title">
                社區基本資訊
              </h2>
            </div>
            <div className="card-body">
              <div className="community-details">
                <div className="detail-item">
                  <label className="detail-label">社區名稱</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editCommunityName}
                      onChange={(e) => setEditCommunityName(e.target.value)}
                      className="form-input"
                      placeholder="請輸入社區名稱"
                    />
                  ) : (
                    <div className="detail-value">{communityName || '未設定'}</div>
                  )}
                </div>

                <div className="detail-item">
                  <label className="detail-label">社區描述</label>
                  {isEditing ? (
                    <textarea
                      value={editCommunityDescription}
                      onChange={(e) => setEditCommunityDescription(e.target.value)}
                      className="form-input textarea"
                      rows="4"
                      placeholder="請輸入社區描述"
                    />
                  ) : (
                    <div className="detail-value description">
                      {communityDescription || '未設定社區描述'}
                    </div>
                  )}
                </div>

                <div className="detail-item">
                  <label className="detail-label">總戶數</label>
                  <div className="detail-value">{communityStats.totalUnits} 戶</div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">進行中會議</label>
                  <div className="detail-value">{communityStats.activeMeetings} 場</div>
                </div>
              </div>

              {isEditing && (
                <div className="edit-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    儲存變更
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 快速操作 */}
          {role === 'admin' && (
            <div className="quick-actions-section">
              <div className="card-header">
                <h2 className="card-title">
                  快速操作
                </h2>
              </div>
              <div className="quick-actions-grid">
                <button className="action-card" disabled>
                  <span className="action-title">發佈開會通知</span>
                  <span className="action-subtitle">發送會議通知給住戶</span>
                </button>
                <button className="action-card" disabled>
                  <span className="action-title">住戶管理</span>
                  <span className="action-subtitle">管理住戶清單與資料</span>
                </button>
              </div>
              <p className="actions-note">
                以上功能正在開發中，敬請期待
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
