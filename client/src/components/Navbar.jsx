import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, MessageCircle, CheckSquare, Timer, Target, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    if (!user) return null; // Hide navbar if not logged in

    const links = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/videos', label: 'Videos', icon: Video },
        { path: '/doubts', label: 'Doubts', icon: MessageCircle },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/timers', label: 'Pomodoro', icon: Timer },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '70px' }}>
                {links.map(({ path, label, icon: Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link to={path} key={path} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', color: isActive ? 'var(--primary)' : 'var(--text-dim)', transition: 'color 0.3s' }}>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-bg"
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        width: '40px',
                                        height: '4px',
                                        background: 'var(--primary)',
                                        borderRadius: '0 0 4px 4px'
                                    }}
                                />
                            )}
                            <Icon size={24} />
                            <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
