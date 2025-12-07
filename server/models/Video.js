const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, default: 'Student' },
    createdAt: { type: Date, default: Date.now }
});

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String }, // For external URLs
    filePath: { type: String }, // For uploaded files
    isUploaded: { type: Boolean, default: false },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: [CommentSchema],
    category: { type: String, default: 'General' },
    createdBy: { type: String, default: 'Instructor' }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
