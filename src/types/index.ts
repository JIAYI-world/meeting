export interface Material {
  id: string;
  name: string;
  type: 'text' | 'file';
  content: string;
  summary: string;
  isAnalyzing: boolean;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  background: string;
  materials: Material[];
  agenda: AgendaItem[];
  minutes: Minutes | null;
  todos: Todo[];
  previewSummary: string;
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

export interface Minutes {
  id: string;
  meetingId: string;
  rawInput: string;
  content: string;
  decisions: string[];
  createdAt: string;
}

export interface Todo {
  id: string;
  content: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export type TabType = 'agenda' | 'minutes';
