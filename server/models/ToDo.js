const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ToDo', ToDoSchema);
