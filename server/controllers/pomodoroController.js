const Pomodoro = require('../models/Pomodoro');
const User = require('../models/User');

exports.logSession = async (req, res) => {
    try {
        const { duration } = req.body;
        const session = new Pomodoro({ duration });
        await session.save();

        // Update user stats (Assuming single user for now or handled via ID)
        // Update user stats
        let user = await User.findById(req.user.id);
        if (user) {
            user.studyMinutes += duration;
            user.credits += Math.floor(duration / 10); // 1 credit per 10 mins
            await user.save();
        }

        res.status(201).json({ session, user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const sessions = await Pomodoro.find().sort({ completedAt: -1 }).limit(10);
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        // Increment study minutes by 1
        let user = await User.findById(req.user.id);
        if (user) {
            user.studyMinutes += 1;
            await user.save();
            res.json({ message: 'Progress updated', studyMinutes: user.studyMinutes });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
