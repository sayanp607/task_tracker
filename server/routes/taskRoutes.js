import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// GET task statistics (MongoDB Aggregation)
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          totalTasks: [
            { $count: 'count' }
          ]
        }
      }
    ]);
    res.status(200).json(stats[0]);
  } catch (error) {
    next(error);
  }
});

// GET all tasks (with optional sorting/filtering/searching)
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, sortBy, order, search } = req.query;
    
    // Filtering & Searching
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default sort by newest
    if (sortBy) {
      sort = {};
      sort[sortBy] = order === 'asc' ? 1 : -1;
    }

    const tasks = await Task.find(filter).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET single task by ID
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// POST create new task
router.post('/', async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// PUT update task by ID
router.put('/:id', async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE task by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
