import React from 'react';
import Layout from './components/Layout';
import { useMeetings } from './hooks/useMeetings';

const App: React.FC = () => {
  const {
    meetings,
    selectedMeeting,
    setSelectedMeeting,
    createMeeting,
    editMeeting,
    removeMeeting,
  } = useMeetings();

  return (
    <Layout
      meetings={meetings}
      selectedMeeting={selectedMeeting}
      onSelectMeeting={setSelectedMeeting}
      onCreateMeeting={createMeeting}
      onUpdateMeeting={editMeeting}
      onDeleteMeeting={removeMeeting}
    />
  );
};

export default App;
