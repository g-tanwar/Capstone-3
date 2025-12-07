import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../context/TimerContext';
import { Sparkles } from 'lucide-react';

const MotivationToast = () => {
    const { motivation } = useTimer();

    return (
        <AnimatePresence>
            {motivation && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: '100px',
                        right: '20px',
                        zIndex: 1500,
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        padding: '1rem 1.5rem',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        maxWidth: '300px'
                    }}
                >
                    <Sparkles color="white" size={24} />
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{motivation}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MotivationToast;
