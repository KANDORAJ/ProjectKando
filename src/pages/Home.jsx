import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Home() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [category, setCategory] = useState(""); 
    const [filterCategory, setFilterCategory] = useState(""); 

    const addTask = () => {
        if (task.trim() !== "") {
            setTasks([...tasks, { text: task, completed: false, category }]);
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
        if (!result.destination) {
            return;
        }
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
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks
                                .filter(task => filterCategory === "" || task.category === filterCategory)
                                .map((task, index) => (
                                    <Draggable key={index} draggableId={index.toString()} index={index}>
                                        {(provided) => (
                                            <li 
                                                ref={provided.innerRef} 
                                                {...provided.draggableProps} 
                                                {...provided.dragHandleProps}
                                                style={{ 
                                                    ...provided.draggableProps.style, 
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    backgroundColor: '#f9f9f9',
                                                    padding: '10px',
                                                    marginBottom: '5px',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                {editingIndex === index ? (
                                                    <span>
                                                        <input
                                                            type="text"
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                        />
                                                        <button onClick={() => saveTask(index)}>Save</button>
                                                    </span>
                                                ) : (
                                                    <span onClick={() => toggleTaskCompletion(index)}>
                                                        {task.text} ({task.category})
                                                    </span>
                                                )}
                                                <button onClick={() => deleteTask(index)}>Delete</button>
                                                {editingIndex !== index && (
                                                    <button onClick={() => startEditing(index)}>Edit</button>
                                                )}
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
