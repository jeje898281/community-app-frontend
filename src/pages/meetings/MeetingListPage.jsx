// src/pages/meetings/MeetingListPage.jsx
import React, { useEffect, useState } from 'react';
import { listMeetings } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/MeetingList.css';

export default function MeetingListPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    listMeetings()
      .then(res => setMeetings(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { text: '待開始', class: 'badge-warning' },
      'active': { text: '進行中', class: 'badge-success' },
      'completed': { text: '已結束', class: 'badge-primary' },
      'cancelled': { text: '已取消', class: 'badge-error' }
    };

    const config = statusConfig[status] || { text: status, class: 'badge-primary' };
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    });
  };

  const filterMeetings = (meetings) => {
    if (activeFilter === 'all') return meetings;
    if (activeFilter === 'active') return meetings.filter(m => m.status === 'active');
    if (activeFilter === 'pending') return meetings.filter(m => m.status === 'pending');
    if (activeFilter === 'completed') return meetings.filter(m => m.status === 'completed');
    return meetings;
  };

  const filteredMeetings = filterMeetings(meetings);

  if (loading) {
    return (
      <div className="meeting-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>載入會議資料中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-list-container">
      <div className="meeting-list-header">
        <div className="header-content">
          <h1 className="page-title">
            會議列表
          </h1>
        </div>
        <button className="btn btn-primary">
          新增會議
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          全部 ({meetings.length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`}
          onClick={() => setActiveFilter('active')}
        >
          進行中 ({meetings.filter(m => m.status === 'active').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          待開始 ({meetings.filter(m => m.status === 'pending').length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          已結束 ({meetings.filter(m => m.status === 'completed').length})
        </button>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>目前沒有會議</h3>
          <p>
            {activeFilter === 'all'
              ? '尚未安排任何會議，請聯繫管理員'
              : `目前沒有${activeFilter === 'active' ? '進行中' : activeFilter === 'pending' ? '待開始' : '已結束'}的會議`
            }
          </p>
          <button className="btn btn-secondary">
            重新整理
          </button>
        </div>
      ) : (
        <div className="meetings-grid">
          {filteredMeetings.map(meeting => (
            <div key={meeting.id} className="meeting-card">
              <div className="meeting-card-header">
                <h3 className="meeting-title">{meeting.name}</h3>
                {getStatusBadge(meeting.status)}
              </div>

              <div className="meeting-card-body">
                <div className="meeting-info">
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span className="info-text">{formatDate(meeting.date)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⏰</span>
                    <span className="info-text">
                      {new Date(meeting.date).toLocaleTimeString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {meeting.location && (
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span className="info-text">{meeting.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="meeting-card-footer">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/meetings/${meeting.id}/scan`)}
                  disabled={meeting.status === 'completed' || meeting.status === 'cancelled'}
                >
                  {meeting.status === 'active' ? '進入會議' : '會議管理'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
