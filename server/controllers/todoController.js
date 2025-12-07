const ToDo = require('../models/ToDo');

exports.getAllTodos = async (req, res) => {
    try {
        const { sort, page = 1, limit = 10 } = req.query;
        let sortOption = { createdAt: -1 };
        if (sort === 'priority') sortOption = { priority: -1 }; // Needs mapping if string, simplified here

        const todos = await ToDo.find()
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTodo = async (req, res) => {
    try {
        const todo = new ToDo(req.body);
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const updatedTodo = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        await ToDo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
