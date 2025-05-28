//src/contexts/MeetingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeetingById } from '../services/api';

const MeetingContext = createContext(null);

export function MeetingProvider({ meetingId, children }) {
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!meetingId) return;
        setLoading(true);
        getMeetingById(meetingId)
            .then(res => setMeeting(res.data.data))
            .finally(() => setLoading(false));
    }, [meetingId]);

    return (
        <MeetingContext.Provider value={{ meeting, loading }}>
            {children}
        </MeetingContext.Provider>
    );
}

export const useMeeting = () => useContext(MeetingContext);
