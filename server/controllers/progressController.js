const User = require('../models/User');
const Pomodoro = require('../models/Pomodoro');
const ToDo = require('../models/ToDo');

exports.getSummary = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const completedTasks = await ToDo.countDocuments({ isCompleted: true });
        const totalTasks = await ToDo.countDocuments();

        // Get last 7 days study data for graph
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const sessions = await Pomodoro.find({
                completedAt: { $gte: d, $lt: nextDay }
            });
            const minutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);
            last7Days.push({ date: d.toISOString().split('T')[0], minutes });
        }

        res.json({
            user,
            taskStats: { completed: completedTasks, total: totalTasks },
            studyData: last7Days
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
