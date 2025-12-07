import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useTimer } from '../context/TimerContext';
import { Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ user: {}, taskStats: {}, studyData: [] });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/progress');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ paddingBottom: '100px', paddingTop: '20px' }}
        >
            <MiniTimer />
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome, {stats.user.username || 'Learner'}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card">
                    <h3 style={{ color: 'var(--text-dim)' }}>Study Minutes</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.user.studyMinutes || 0}m</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-dim)' }}>Credits</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.user.credits || 0}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-dim)' }}>Tasks Completed</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                        {stats.taskStats?.completed || 0} / {stats.taskStats?.total || 0}
                    </p>
                </div>
            </div>

            <div className="card" style={{ height: '400px' }}>
                <h3 style={{ marginBottom: '20px' }}>Learning Momentum</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.studyData}>
                        <defs>
                            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <Area type="monotone" dataKey="minutes" stroke="#6366f1" fillOpacity={1} fill="url(#colorMinutes)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const MiniTimer = () => {
    const { timeLeft, isActive, mode } = useTimer();

    if (!isActive && timeLeft === 25 * 60) return null; // Don't show if not started

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card"
            style={{
                marginBottom: '20px',
                background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
                borderColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Timer className={isActive ? "animate-pulse" : ""} color="var(--primary)" />
                <div>
                    <h4 style={{ margin: 0, lineHeight: 1, textTransform: 'capitalize' }}>
                        {mode === 'short' ? 'Short Break' : mode === 'long' ? 'Long Break' : 'Focus Session'}
                        {isActive ? ' Active' : ' Paused'}
                    </h4>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>
            <Link to="/timers" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                View <ArrowRight size={16} />
            </Link>
        </motion.div>
    );
};

export default Dashboard;
