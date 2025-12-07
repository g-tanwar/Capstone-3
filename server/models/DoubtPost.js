const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    createdAt: { type: Date, default: Date.now }
});

const DoubtPostSchema = new mongoose.Schema({
    question: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    tags: [{ type: String }],
    answers: [AnswerSchema],
    downloads: { type: Number, default: 0 },
    resolved: { type: Boolean, default: false },
    votes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DoubtPost', DoubtPostSchema);
