import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

const VictoryPopup = () => {
    const { showVictory, setShowVictory } = useTimer();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <AnimatePresence>
            {showVictory && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                    <Confetti width={windowSize.width} height={windowSize.height} />
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="card"
                        style={{ textAlign: 'center', padding: '3rem', maxWidth: '400px', position: 'relative', border: '2px solid var(--success)' }}
                    >
                        <button
                            onClick={() => setShowVictory(false)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', color: 'var(--text-dim)' }}
                        >
                            <X />
                        </button>
                        <div style={{ background: 'rgba(34, 197, 94, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Trophy size={40} color="var(--success)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--success)' }}>Session Complete!</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '20px' }}>
                            You just focused for 25 minutes. Great job! Take a short break now.
                        </p>
                        <button onClick={() => setShowVictory(false)} className="btn btn-primary" style={{ width: '100%' }}>
                            Awesome!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VictoryPopup;
