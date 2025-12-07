const Video = require('../models/Video');
const User = require('../models/User');

// GET /api/videos
exports.getAllVideos = async (req, res) => {
    try {
        const { search, category, sort, page = 1, limit = 10 } = req.query;

        const query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (category && category !== 'All') {
            query.category = category;
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'views') sortOption = { views: -1 };
        if (sort === 'likes') sortOption = { likes: -1 };

        const videos = await Video.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Video.countDocuments(query);

        res.json({
            videos,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalVideos: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createVideo = async (req, res) => {
    try {
        let videoData = req.body;

        // Handle File Upload
        if (req.file) {
            videoData.filePath = req.file.path;
            videoData.isUploaded = true;
            // Construct accessible URL
            // Assuming server runs on same host/port logic or forwarded
            // We'll store relative path, frontend constructs full URL
        }

        const video = new Video(videoData);
        const savedVideo = await video.save();

        // Award credits to uploader (mock user logic)
        // Award credits to uploader
        if (req.user) {
            let user = await User.findById(req.user.id);
            if (user) {
                user.credits += 50;
                await user.save();
            }
        }

        res.status(201).json(savedVideo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        video.views += 1;
        await video.save();

        res.json(video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedVideo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Social Features
exports.likeVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        video.likes += 1;
        await video.save();

        // Award credit to creator
        // Implementation note: Ideally we track who liked so they can't spam, 
        // but for this MVP we just increment.

        res.json(video);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.commentVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const { text, author } = req.body;
        video.comments.push({ text, author: author || 'Student' });
        await video.save();

        res.json(video);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
