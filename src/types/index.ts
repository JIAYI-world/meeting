export type MeetingScene = 'requirement' | 'incident' | 'sync' | 'technical' | 'other';

export interface Material {
  id: string;
  name: string;
  type: 'text' | 'file';
  content: string;
  summary: string;
  isAnalyzing: boolean;
  enabled: boolean;
  relevance: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface PreTodo {
  id: string;
  content: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  background: string;
  scene: MeetingScene;
  materials: Material[];
  agenda: AgendaItem[];
  minutes: Minutes | null;
  todos: Todo[];
  preTodos: PreTodo[];
  previewSummary: string;
  rawInput: string;
  transcript: string;
  status: 'preparing' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  duration: number;
  presenter: string;
  order: number;
}

export interface MinuteChapter {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  rawSnippet: string;
}

export interface Decision {
  id: string;
  conclusion: string;
  reason: string;
  isRejected: boolean;
}

export interface Minutes {
  id: string;
  meetingId: string;
  rawInput: string;
  content: string;
  chapters: MinuteChapter[];
  decisions: Decision[];
  createdAt: string;
}

export interface ContextSnippet {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface Todo {
  id: string;
  content: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  contextSnippet: ContextSnippet;
}

export type TabType = 'agenda' | 'minutes';
