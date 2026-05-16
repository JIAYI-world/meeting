import { useState, useEffect } from 'react';
import { Meeting } from '../types';
import { getMeetings, addMeeting, updateMeeting, deleteMeeting } from '../utils/storage';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    setMeetings(getMeetings());
  }, []);

  const createMeeting = (meeting: Meeting) => {
    const updated = addMeeting(meeting);
    setMeetings(updated);
    setSelectedMeeting(meeting);
  };

  const editMeeting = (meeting: Meeting) => {
    const updated = updateMeeting(meeting);
    setMeetings(updated);
    if (selectedMeeting?.id === meeting.id) {
      setSelectedMeeting(meeting);
    }
  };

  const removeMeeting = (id: string) => {
    const updated = deleteMeeting(id);
    setMeetings(updated);
    if (selectedMeeting?.id === id) {
      setSelectedMeeting(null);
    }
  };

  return {
    meetings,
    selectedMeeting,
    setSelectedMeeting,
    createMeeting,
    editMeeting,
    removeMeeting,
  };
}
