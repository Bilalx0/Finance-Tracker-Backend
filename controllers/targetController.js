const Target = require('../models/Target');

// Get current month/year targets by default
exports.getAllTargets = async (req, res) => {
  try {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const targets = await Target.findAll({ 
      where: { 
        userId: req.user.id,
        month,
        year
      } 
    });
    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
};

exports.createTarget = async (req, res) => {
  try {
    const { name, amount } = req.body; // Changed to match frontend
    if (!name || !amount) {
      return res.status(400).json({ error: 'Target name and amount are required' });
    }

    const currentDate = new Date();
    const target = await Target.create({
      name,
      amount,
      month: currentDate.getMonth() + 1, // Auto-set
      year: currentDate.getFullYear(),    // Auto-set
      userId: req.user.id,
    });

    res.status(201).json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create target' });
  }
};

exports.updateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body; // Changed to match frontend

    const target = await Target.findOne({ where: { id, userId: req.user.id } });
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    await target.update({ name, amount });
    res.status(200).json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update target' });
  }
};

exports.deleteTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Target.findOne({ where: { id, userId: req.user.id } });
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    await target.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete target' });
  }
};