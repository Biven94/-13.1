import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import './styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const fetchTasksFromAPI = async () => {
      try {
        const response = await fetch('https://6950d85c5a9c0b64.mokky.dev/task');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data); // Установка полученных задач в состояние
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      }
    };

    fetchTasksFromAPI(); // Выполнение загрузки задач при монтировании компонента
  }, []); // Пустой массив зависимостей означает выполнение один раз при загрузке

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // Сохранение задач в локальное хранилище при изменении

  const addTask = async () => {
    if (newTaskText.trim() === '') {
      return;
    }
    try {
      const response = await fetch('https://6950d85c5a9c0b64.mokky.dev/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTaskText, completed: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const newTask = await response.json();
      setTasks([...tasks, newTask]); // Добавление новой задачи в состояние
      setNewTaskText(''); // Очистка поля ввода
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://6950d85c5a9c0b64.mokky.dev/task/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter((task) => task.id !== taskId)); // Удаление задачи из состояния
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === taskId);
      const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };
      const response = await fetch(`https://6950d85c5a9c0b64.mokky.dev/task/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle task completion');
      }
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task))); // Обновление состояния задачи
    } catch (error) {
      console.error('Error toggling task completion:', error.message);
    }
  };

  const filterTasks = (completed) => {
    return tasks.filter((task) => task.completed === completed);
  };

  return (
    <div className="task-list">
      <h2>Список задач</h2>
      <form
        className="form-container"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          name="taskInput"
          placeholder="Введите новую задачу"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button type="submit">Добавить задачу</button>
      </form>
      <div className="tasks">
        <h3>Невыполненные задачи</h3>
        {filterTasks(false).map((task) => (
          <TaskItem key={task.id} task={task} onDelete={deleteTask} onToggle={toggleTaskCompletion} />
        ))}
        <h3>Выполненные задачи</h3>
        {filterTasks(true).map((task) => (
          <TaskItem key={task.id} task={task} onDelete={deleteTask} onToggle={toggleTaskCompletion} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
