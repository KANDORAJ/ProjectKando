import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

// SortableItem component for draggable list items
function SortableItem({ id, task, index, onDelete, onEdit, toggleCompletion, editingIndex, setEditingIndex, editingText, setEditingText, saveTask }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    userSelect: 'none',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {editingIndex === index ? (
        <span style={{ flex: 1, marginRight: '10px' }}>
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
          <button onClick={() => saveTask(index)}>Save</button>
        </span>
      ) : (
        <span
          onClick={() => toggleCompletion(index)}
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            flex: 1,
            marginRight: '10px',
          }}
        >
          {task.text} ({task.category})
        </span>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => onDelete(index)}>Delete</button>
        {editingIndex !== index && (
          <button onClick={() => onEdit(index)}>Edit</button>
        )}
      </div>
    </li>
  );
}

function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [category, setCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, { id: uuidv4(), text: task, completed: false, category }]);
      setTask("");
      setCategory("");
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

  return (
    <div className="container">
      <h2>Task List</h2>
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
        <SortableContext items={tasks.map(task => task.id)}>
          <ul style={{ padding: 0 }}>
            {tasks
              .filter(task => filterCategory === "" || task.category === filterCategory)
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
                />
              ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Home;
