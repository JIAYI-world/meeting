import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import { useMeetings } from './hooks/useMeetings';
import { getMeetings } from './utils/storage';

const App: React.FC = () => {
  const {
    meetings,
    selectedMeeting,
    setSelectedMeeting,
    createMeeting,
    editMeeting,
    removeMeeting,
  } = useMeetings();

  const [, setTick] = useState(0);

  const handleSeedComplete = useCallback(() => {
    const fresh = getMeetings();
    setTick((t) => t + 1);
    if (fresh.length > 0 && !selectedMeeting) {
      setSelectedMeeting(fresh[0]);
    }
  }, [selectedMeeting, setSelectedMeeting]);

  return (
    <Layout
      meetings={meetings}
      selectedMeeting={selectedMeeting}
      onSelectMeeting={setSelectedMeeting}
      onCreateMeeting={createMeeting}
      onUpdateMeeting={editMeeting}
      onDeleteMeeting={removeMeeting}
      onSeedComplete={handleSeedComplete}
    />
  );
};

export default App;
