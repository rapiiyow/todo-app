import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling

function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Show loading spinner during API calls

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/todo');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();
            setTodos(data);
        } catch (err) {
            setError('Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async () => {
        if (!title.trim()) {
            setError('Todo title cannot be empty');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            await fetchTodos();
            setTitle('');
            setError(null);
        } catch (err) {
            setError('Failed to add todo');
        } finally {
            setLoading(false);
        }
    };

    const toggleTodo = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/todo/${id}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                throw new Error('Failed to toggle todo');
            }

            await fetchTodos();
        } catch (err) {
            setError('Failed to toggle todo');
        } finally {
            setLoading(false);
        }
    };

    const deleteTodo = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/todo/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            await fetchTodos();
        } catch (err) {
            setError('Failed to delete todo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <h1 className="app-title">Todo List</h1>
            <div className="todo-input-section">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter new todo"
                    className="todo-input"
                />
                <button onClick={addTodo} className="add-todo-button">Add Todo</button>
            </div>
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className="todo-item">
                        <span
                            className={`todo-title ${todo.isCompleted ? 'completed' : ''}`}
                            onClick={() => toggleTodo(todo.id)}
                        >
                            {todo.title}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
