import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Award, Clock, Star, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/progress');
            setStats(res.data);
        } catch (err) { console.error(err); }
    };

    if (!stats) return <div className="container" style={{ paddingTop: '50px', textAlign: 'center' }}>Loading Profile...</div>;

    const { user, taskStats } = stats;
    const minutes = user.studyMinutes || 0;

    // Badge Logic
    const badges = [
        { name: 'Bronze Scholar', min: 60, icon: Star, color: '#cd7f32', desc: 'Studied for 1 hour' },
        { name: 'Silver Scholar', min: 300, icon: Star, color: '#c0c0c0', desc: 'Studied for 5 hours' },
        { name: 'Gold Scholar', min: 1000, icon: Star, color: '#ffd700', desc: 'Studied for 10+ hours' },
        { name: 'Diamond Scholar', min: 5000, icon: Award, color: '#b9f2ff', desc: 'Studied for 80+ hours' },
        { name: 'Task Master', min: 10, type: 'task', icon: CheckCircle, color: '#4ade80', desc: 'Completed 10 tasks' }
    ];

    // Separate check for task badge logic if we had it, for now just minutes
    // Actually we have taskStats.completed

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingBottom: '100px', paddingTop: '20px' }}>

            {/* Header */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={40} color="white" />
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{user.username}</h1>
                    <p style={{ margin: 0, color: 'var(--text-dim)' }}>{user.email || 'Student'}</p>
                </div>
                <button onClick={useAuth().logout} style={{ marginLeft: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                <StatCard icon={Clock} label="Study Time" value={`${Math.floor(minutes / 60)}h ${minutes % 60}m`} color="#6366f1" />
                <StatCard icon={Zap} label="Credits" value={user.credits} color="#eab308" />
                <StatCard icon={CheckCircle} label="Tasks Done" value={taskStats.completed} color="#22c55e" />
            </div>

            {/* Badges */}
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award color="var(--primary)" /> Achievements
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {badges.map((badge, i) => {
                    let isUnlocked = false;
                    if (badge.type === 'task') {
                        isUnlocked = taskStats.completed >= badge.min;
                    } else {
                        isUnlocked = minutes >= badge.min;
                    }

                    return (
                        <div key={i} className="card" style={{
                            opacity: isUnlocked ? 1 : 0.4,
                            border: isUnlocked ? `1px solid ${badge.color}` : '1px solid transparent',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%',
                                background: isUnlocked ? badge.color : '#333',
                                margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <badge.icon size={24} color={isUnlocked ? '#fff' : '#666'} />
                            </div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '5px' }}>{badge.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{badge.desc}</p>
                            {!isUnlocked && <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '5px' }}>Locked</p>}
                        </div>
                    );
                })}
            </div>

        </motion.div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
        <Icon size={28} color={color} style={{ marginBottom: '10px' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 5px' }}>{value}</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{label}</span>
    </div>
);

// Helper for check circle since it wasn't imported initially in my mind map, but I used it in code.
// Let's add it to imports.
import { CheckCircle } from 'lucide-react';

export default Profile;
