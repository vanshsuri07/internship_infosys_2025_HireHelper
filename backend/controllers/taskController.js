const Task = require("../models/Task");
const mongoose = require("mongoose");

//Create Task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      start_time,
      end_time,
      picture,
      status,
    } = req.body;

    if (!title || !description || !location || !start_time) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: title, description, location, and start_time",
      });
    }

    if (end_time && new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      location,
      start_time,
      end_time,
      picture: picture || "",
      status: status || "open",
    });

    await task.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

//Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const {
      status,
      location,
      start_date,
      end_date,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query object
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by date range
    if (start_date || end_date) {
      query.start_time = {};
      if (start_date) {
        query.start_time.$gte = new Date(start_date);
      }
      if (end_date) {
        query.start_time.$lte = new Date(end_date);
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const tasks = await Task.find(query)
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limitNum);

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalTasks,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
};

//Get My Tasks
exports.getMyTasks = async (req, res) => {
  try {
    const { status, sort = "-createdAt", page = 1, limit = 10 } = req.query;

    // Build query object for current user
    const query = { user: req.user._id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const tasks = await Task.find(query)
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limitNum);

    res.status(200).json({
      success: true,
      message: "Your tasks retrieved successfully",
      data: tasks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalTasks,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your tasks",
      error: error.message,
    });
  }
};

//Get Task By ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id).populate("user", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
};

//Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      start_time,
      end_time,
      picture,
      status,
    } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
      });
    }

    // Validate end_time is after start_time
    const newStartTime = start_time ? new Date(start_time) : task.start_time;
    const newEndTime = end_time ? new Date(end_time) : task.end_time;

    if (newEndTime && newEndTime <= newStartTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (location !== undefined) task.location = location;
    if (start_time !== undefined) task.start_time = start_time;
    if (end_time !== undefined) task.end_time = end_time;
    if (picture !== undefined) task.picture = picture;
    if (status !== undefined) task.status = status;

    await task.save();

    // Populate user details
    await task.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

//Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    // Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { id: task._id },
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};
