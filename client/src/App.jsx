import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Doubts from './pages/Doubts';
import Tasks from './pages/Tasks';
import Timers from './pages/Timers';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { TimerProvider } from './context/TimerContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import VictoryPopup from './components/VictoryPopup';
import MotivationToast from './components/MotivationToast';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>Please <a href="/login" style={{ color: 'var(--primary)' }}>login</a> to access this page.</div>;
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <div style={{ paddingBottom: '80px' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
              <Route path="/doubts" element={<ProtectedRoute><Doubts /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/timers" element={<ProtectedRoute><Timers /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
            <Navbar />
            <VictoryPopup />
            <MotivationToast />
          </div>
        </TimerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
