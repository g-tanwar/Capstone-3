import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ width: '100%', maxWidth: '400px' }}
                onSubmit={handleSubmit}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>
                {error && <div style={{ background: 'var(--secondary)', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        className="input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
                </p>
            </motion.form>
        </div>
    );
};

export default Login;
