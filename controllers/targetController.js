const Target = require('../models/Target');

exports.getAllTargets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const where = { userId: req.user.id }; 

    if (month) where.month = month;
    if (year) where.year = year;

    const targets = await Target.findAll({ where });
    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
};

exports.createTarget = async (req, res) => {
  try {
    const { targetName, targetAmount, month, year } = req.body;
    if (!targetName || !targetAmount) {
      return res.status(400).json({ error: 'Target name and amount are required' });
    }

    const target = await Target.create({
      targetName,
      targetAmount,
      month,
      year,
      userId: req.user.id, // Assuming user is set from auth middleware
    });

    res.status(201).json(target);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create target' });
  }
};

exports.updateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetName, targetAmount, month, year } = req.body;

    const target = await Target.findOne({ where: { id, userId: req.user.id } });
    if (!target) {
      return res.status(404).json({ error: 'Target not found' });
    }

    await target.update({ targetName, targetAmount, month, year });
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