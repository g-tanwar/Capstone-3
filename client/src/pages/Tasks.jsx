import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, Circle, Trash2 } from 'lucide-react';

const Tasks = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const res = await axios.get('http://localhost:5001/api/todos?sort=priority');
        setTodos(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/todos', { task: newTask, priority: 'Medium' });
            setNewTask('');
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComplete = async (todo) => {
        try {
            await axios.put(`http://localhost:5001/api/todos/${todo._id}`, { isCompleted: !todo.isCompleted });
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/todos/${id}`);
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px', paddingTop: '20px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Task Manager</h1>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input
                    className="input"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    required
                />
                <button className="btn btn-primary"><Plus /></button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <AnimatePresence>
                    {todos.map(todo => (
                        <motion.div
                            key={todo._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderLeft: `4px solid ${todo.priority === 'High' ? 'var(--danger)' : 'var(--primary)'}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <button onClick={() => toggleComplete(todo)} style={{ background: 'none', color: todo.isCompleted ? 'var(--success)' : 'var(--text-dim)' }}>
                                    {todo.isCompleted ? <CheckCircle /> : <Circle />}
                                </button>
                                <span style={{
                                    textDecoration: todo.isCompleted ? 'line-through' : 'none',
                                    color: todo.isCompleted ? 'var(--text-dim)' : 'var(--text)'
                                }}>
                                    {todo.task}
                                </span>
                            </div>
                            <button onClick={() => handleDelete(todo._id)} style={{ background: 'none', color: 'var(--danger)', opacity: 0.7 }}>
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Tasks;
