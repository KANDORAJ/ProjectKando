import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

function Home() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [category, setCategory] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

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

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [removed] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, removed);
        setTasks(reorderedTasks);
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

            <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable-tasks">
        {(provided) => (
            <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ padding: 0 }}
            >
                {tasks
                    .filter(task => filterCategory === "" || task.category === filterCategory)
                    .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                                <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  backgroundColor: '#f9f9f9',
                                  padding: '10px',
                                  marginBottom: '5px',
                                  borderRadius: '5px',
                                  border: '1px solid #ddd',
                                  userSelect: 'none',  // Sürükleme sırasında metin seçilmesin
                                }}
                              >
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
                                    onClick={() => toggleTaskCompletion(index)}
                                    style={{
                                      textDecoration: task.completed ? 'line-through' : 'none',
                                      flex: 1,  // Metnin genişleyebilmesi için
                                      marginRight: '10px'  // Butonlar ile metin arasında boşluk
                                    }}
                                  >
                                    {task.text} ({task.category})
                                  </span>
                                )}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button onClick={() => deleteTask(index)}>Delete</button>
                                  {editingIndex !== index && (
                                    <button onClick={() => startEditing(index)}>Edit</button>
                                  )}
                                </div>
                              </li>
                            )}
                        </Draggable>
                    ))}
                {provided.placeholder}
            </ul>
        )}
    </Droppable>
</DragDropContext>
        </div>
    );
}

export default Home;
