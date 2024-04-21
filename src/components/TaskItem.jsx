import React from 'react';
import './styles/TaskItem.css'

const TaskItem = ({ task, onDelete, onToggle }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <span className="task-text" onClick={() => onToggle(task.id)}>{task.text}</span>
      <button className="delete-button" onClick={() => onDelete(task.id)}>Удалить</button>
    </div>
  );
};

export default TaskItem;