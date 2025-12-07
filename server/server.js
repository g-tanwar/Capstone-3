require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('server/uploads'));

// Routes
const videoRoutes = require('./routes/videoRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const todoRoutes = require('./routes/todoRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');
const progressRoutes = require('./routes/progressRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/videos', videoRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('PeerSphere API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
