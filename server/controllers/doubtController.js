const DoubtPost = require('../models/DoubtPost');
const User = require('../models/User');

exports.getAllDoubts = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = {};
        if (search) query.question = { $regex: search, $options: 'i' };

        const doubts = await DoubtPost.find(query)
            .sort({ votes: -1, createdAt: -1 }) // Sort by votes then date
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await DoubtPost.countDocuments(query);

        res.json({
            doubts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createDoubt = async (req, res) => {
    try {
        const doubt = new DoubtPost(req.body);
        const savedDoubt = await doubt.save();

        // Award credits for asking
        if (req.user) {
            let user = await User.findById(req.user.id);
            if (user) {
                user.credits += 10;
                await user.save();
            }
        }

        res.status(201).json(savedDoubt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getDoubtById = async (req, res) => {
    try {
        const doubt = await DoubtPost.findById(req.params.id);
        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
        res.json(doubt);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addAnswer = async (req, res) => {
    try {
        const doubt = await DoubtPost.findById(req.params.id);
        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

        doubt.answers.push({
            content: req.body.content,
            author: req.body.author || 'Anonymous'
        });

        await doubt.save();

        // Award credits for answering
        if (req.user) {
            let user = await User.findById(req.user.id);
            if (user) {
                user.credits += 20;
                await user.save();
            }
        }

        res.json(doubt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteDoubt = async (req, res) => {
    try {
        await DoubtPost.findByIdAndDelete(req.params.id);
        res.json({ message: 'Doubt deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.voteDoubt = async (req, res) => {
    try {
        const { type } = req.body; // 'up' or 'down'
        const doubt = await DoubtPost.findById(req.params.id);
        if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

        if (type === 'up') doubt.votes = (doubt.votes || 0) + 1;
        if (type === 'down') doubt.votes = (doubt.votes || 0) - 1;

        await doubt.save();
        res.json(doubt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
