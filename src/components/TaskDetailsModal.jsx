import React, { useEffect } from 'react';
import Modal from 'react-modal';

function TaskDetailsModal({ isOpen, onRequestClose, task, onSave }) {
  const [details, setDetails] = React.useState("");

  // Effect to update details when the task prop changes
  useEffect(() => {
    if (task) {
      setDetails(task.details || "");
    }
  }, [task]);

  const handleSave = () => {
    onSave(details);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Task Details">
      <h2>Task Details</h2>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows="5"
        style={{ width: '100%' }}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default TaskDetailsModal;
