// src/components/layout/MeetingLayout.jsx
import React from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { MeetingProvider, useMeeting } from '../../contexts/MeetingContext';
import '../../styles/MeetingNav.css';

function InnerLayout() {
  const { meeting, loading } = useMeeting();
  if (loading) return <p style={{ padding: 20 }}>載入會議資訊...</p>;
  if (!meeting) return <p style={{ padding: 20 }}>查無此會議</p>;

  return (
    <>
      <nav className="meeting-nav">
        <span className="meeting-title">{meeting.name}</span>
        <NavLink to="scan">掃描報到</NavLink>
        <NavLink to="manual">手動報到</NavLink>
        <NavLink to="summary">統計</NavLink>
        {/* 這兩個功能若還沒做可留空 */}
        <NavLink to="qrcodes">QRCode</NavLink>
        <NavLink to="notify">通知</NavLink>
      </nav>
      <Outlet />
    </>
  );
}

export default function MeetingLayout() {
  const { id } = useParams();
  return (
    <MeetingProvider meetingId={id}>
      <InnerLayout />
    </MeetingProvider>
  );
}
