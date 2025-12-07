import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    // Defaults
    const defaultTimes = {
        focus: 25 * 60,
        short: 5 * 60,
        long: 15 * 60
    };

    const { user } = useAuth(); // Import useAuth to get user ID

    // Key depends on user ID if available
    const STORAGE_KEY = user ? `pomodoroState_${user.id}` : 'pomodoroState_guest';

    // Initialize/Load State
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.isActive) {
                const now = Date.now();
                const passed = Math.floor((now - parsed.timestamp) / 1000);
                const currentModeTime = parsed.timers[parsed.mode];
                const newTime = Math.max(0, currentModeTime - passed);
                return { ...parsed, timers: { ...parsed.timers, [parsed.mode]: newTime } };
            }
            return parsed;
        }
        return {
            mode: 'focus',
            isActive: false,
            timers: { ...defaultTimes },
            timestamp: Date.now()
        };
    });

    const [showVictory, setShowVictory] = useState(false);
    const [motivation, setMotivation] = useState(null);

    // Destructure for easier usage
    const { mode, isActive, timers } = state;
    const timeLeft = timers[mode];

    // Reset state when user changes (e.g. login/logout)
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setState(JSON.parse(saved));
        } else {
            // Default if no saved state for this user
            setState({
                mode: 'focus',
                isActive: false,
                timers: { ...defaultTimes },
                timestamp: Date.now()
            });
        }
    }, [user?.id]); // Re-run when user ID changes

    // Save to LocalStorage
    useEffect(() => {
        if (!user) return; // Don't save for guest if we want strict enforcement, but guest key is fine
        const stateToSave = { ...state, timestamp: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [state, user?.id]);

    // Timer Interval
    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setState(prev => {
                    const newTime = prev.timers[prev.mode] - 1;

                    // Check for 1-minute intervals to update progress (only in focus mode)
                    if (prev.mode === 'focus') {
                        const totalTime = defaultTimes.focus;
                        const elapsed = totalTime - newTime;
                        // Determine if we just hit a minute mark (and it's not the start)
                        // Note: validation > 0 ensures we don't trigger at 0 elapsed
                        if (elapsed > 0 && elapsed % 60 === 0) {
                            axios.put('http://localhost:5001/api/pomodoro/progress')
                                .catch(err => console.error("Progress update failed", err));
                        }
                    }

                    checkMilestones(newTime, prev.mode);
                    return {
                        ...prev,
                        timers: {
                            ...prev.timers,
                            [prev.mode]: newTime
                        }
                    };
                });
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            handleComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]); // timeLeft dependency ensures update

    const checkMilestones = (time, currentMode) => {
        if (currentMode !== 'focus') return;
        const total = defaultTimes.focus;
        const elapsed = total - time;
        if (elapsed === 10 * 60) triggerMotivation("Well done! You're in the flow. Keep crushing it! 🔥");
        if (elapsed === 18 * 60) triggerMotivation("Only 7 minutes left! You're almost there. Finish strong! 🚀");
    };

    const triggerMotivation = (msg) => {
        setMotivation(msg);
        setTimeout(() => setMotivation(null), 5000);
    };

    const handleComplete = async () => {
        setState(prev => ({ ...prev, isActive: false }));
        if (mode === 'focus') {
            setShowVictory(true);
            try {
                await axios.post('http://localhost:5001/api/pomodoro', { duration: 25 });
            } catch (err) { console.error(err); }
        }
        playAlarm();
    };

    const playAlarm = () => {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e => console.log(e));
    };

    const toggleTimer = () => {
        setState(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const resetTimer = () => {
        setState(prev => ({
            ...prev,
            isActive: false,
            timers: {
                ...prev.timers,
                [prev.mode]: defaultTimes[prev.mode]
            }
        }));
    };

    const changeMode = (newMode) => {
        // Switch mode but preserve the state of the old mode (it just pauses effectively if it was active, 
        // effectively we just switch focus. If we want it to actually PAUSE when switching:
        setState(prev => ({
            ...prev,
            mode: newMode,
            isActive: false // Auto-pause when switching modes
        }));
    };

    return (
        <TimerContext.Provider value={{
            timeLeft,
            isActive,
            mode,
            showVictory,
            setShowVictory,
            motivation,
            toggleTimer,
            resetTimer,
            changeMode
        }}>
            {children}
        </TimerContext.Provider>
    );
};
