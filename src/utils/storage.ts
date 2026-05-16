import { Meeting } from '../types';

const STORAGE_KEY = 'meeting-ai-assistant';

export function getMeetings(): Meeting[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMeetings(meetings: Meeting[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

export function addMeeting(meeting: Meeting): Meeting[] {
  const meetings = getMeetings();
  meetings.unshift(meeting);
  saveMeetings(meetings);
  return meetings;
}

export function updateMeeting(updatedMeeting: Meeting): Meeting[] {
  const meetings = getMeetings();
  const index = meetings.findIndex(m => m.id === updatedMeeting.id);
  if (index !== -1) {
    meetings[index] = { ...updatedMeeting, updatedAt: new Date().toISOString() };
    saveMeetings(meetings);
  }
  return meetings;
}

export function deleteMeeting(id: string): Meeting[] {
  const meetings = getMeetings().filter(m => m.id !== id);
  saveMeetings(meetings);
  return meetings;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
