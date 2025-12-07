import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimer } from '../context/TimerContext';

const Timers = () => {
    const { timeLeft, isActive, mode, toggleTimer, resetTimer, changeMode } = useTimer();

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                animate={{ scale: isActive ? 1.05 : 1 }}
                layout
                className="card"
                style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
                    {['focus', 'short', 'long'].map(m => (
                        <button
                            key={m}
                            onClick={() => changeMode(m)}
                            className={`btn ${mode === m ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div style={{ fontSize: '6rem', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '30px', color: isActive ? 'var(--primary)' : 'var(--text)' }}>
                    {formatTime(timeLeft)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button onClick={toggleTimer} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        {isActive ? <Pause /> : <Play />}
                    </button>
                    <button onClick={resetTimer} className="btn btn-secondary">
                        <RotateCcw />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Timers;
