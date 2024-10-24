import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import TaskDetailsModal from '../components/TaskDetailsModal';

// SortableItem component for draggable list items
function SortableItem({ id, task, index, onDelete, onEdit, toggleCompletion, editingIndex, setEditingIndex, editingText, setEditingText, saveTask, openModal }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const backgroundColor = categoryColors[task.category] || categoryColors.Default;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor,
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    userSelect: 'none',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {editingIndex === index ? (
        <span style={{ flex: 1, marginRight: "10px" }}>
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
          <button onClick={() => saveTask(index)}>Save</button>
          <button onClick={() => openModal(task)}>Details</button>
        </span>
      ) : (
        <span
          onClick={() => toggleCompletion(index)}
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            flex: 1,
            marginRight: "10px",
          }}
        >
          {task.text} ({task.category})
          <br />
          <small style={{ color: "#888" }}>{task.details}
          <br />
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No deadline"}
          </small>
        </span>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => onDelete(index)}>Delete</button>
        {editingIndex !== index && <button onClick={() => onEdit(index)}>Edit</button>}
      </div>
    </li>
  );
}

const categoryColors = {
  Work: "#FFD700", 
  Home: "#87CEEB", 
  Personal: "#FFB6C1", 
  Default: "#f9f9f9", 
};

function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [category, setCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
    console.log("Tasks loaded from localStorage:", savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Tasks updated:", tasks);
    }
  }, [tasks]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, { id: uuidv4(), text: task, completed: false, category, details: "", dueDate: dueDate }]);
      setTask("");
      setCategory("");
      setDueDate("");
    }
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editingText } : task
    );
    setTasks(newTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      setTasks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  /*Dark Mode*/
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  /*Cyberpunk Mode*/
  const [cyberpunkMode, setCyberpunkMode] = useState(false);

const toggleCyberpunkMode = () => {
  setCyberpunkMode(!cyberpunkMode);
  if (!cyberpunkMode) {
    document.body.classList.add('cyberpunk-mode');
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.remove('cyberpunk-mode');
  }
};
  
  // Function to save task details
  const saveTaskDetails = (details) => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...task, details } : task
    );
    setTasks(updatedTasks);
    setIsModalOpen(false);  // Close modal
    setSelectedTask(null);  // Clear selected task
  };

  // Function to open modal
  const openModal = (task) => {
    if (!isModalOpen) {
      setSelectedTask(task); 
      setIsModalOpen(true); 
    }
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false); 
    setSelectedTask(null); 
  };


  return (
    <div className="container">
      <h2>Task List</h2>
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add new task..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Work">Work</option>
        <option value="Home">Home</option>
        <option value="Personal">Personal</option>
      </select>
      
      <div className="input-container">
  <label htmlFor="dueDate">Select Due Date</label>
  <input
    type="datetime-local"
    id="dueDate"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
  />
</div>
      <button onClick={addTask}>Add Task</button>

      <div>
        <label>Filter by Category: </label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All</option>
          <option value="Work">Work</option>
          <option value="Home">Home</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((task) => task.id)}>
          <ul style={{ padding: 0 }}>
            {tasks
              .filter((task) => filterCategory === "" || task.category === filterCategory)
              .map((task, index) => (
                <SortableItem
                  key={task.id}
                  id={task.id}
                  task={task}
                  index={index}
                  onDelete={deleteTask}
                  onEdit={startEditing}
                  toggleCompletion={toggleTaskCompletion}
                  editingIndex={editingIndex}
                  setEditingIndex={setEditingIndex}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  saveTask={saveTask}
                  openModal={openModal} // function to open modal
                />
              ))}
          </ul>
        </SortableContext>
      </DndContext>

      {isModalOpen && selectedTask && (
        <TaskDetailsModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          task={selectedTask}
          onSave={saveTaskDetails}
        />
      )}
      <button className="cyberpunk-toggle-btn" onClick={toggleCyberpunkMode}>
        {cyberpunkMode ? 'Default Mode' : 'Cyberpunk Mode'}
      </button>
    </div>
  );
}

export default Home;
