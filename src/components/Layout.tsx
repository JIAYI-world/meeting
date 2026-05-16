import React from 'react';
import Sidebar from './Sidebar';
import MainWorkspace from './MainWorkspace';
import { Meeting } from '../types';

interface LayoutProps {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  onSelectMeeting: (meeting: Meeting) => void;
  onCreateMeeting: (meeting: Meeting) => void;
  onUpdateMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  meetings,
  selectedMeeting,
  onSelectMeeting,
  onCreateMeeting,
  onUpdateMeeting,
  onDeleteMeeting,
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        meetings={meetings}
        selectedMeeting={selectedMeeting}
        onSelectMeeting={onSelectMeeting}
        onCreateMeeting={onCreateMeeting}
        onDeleteMeeting={onDeleteMeeting}
      />
      <MainWorkspace
        meeting={selectedMeeting}
        onUpdateMeeting={onUpdateMeeting}
      />
    </div>
  );
};

export default Layout;
