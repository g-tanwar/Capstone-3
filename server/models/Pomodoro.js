const mongoose = require('mongoose');

const PomodoroSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional simple link
    duration: { type: Number, required: true }, // in minutes
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Pomodoro', PomodoroSchema);
