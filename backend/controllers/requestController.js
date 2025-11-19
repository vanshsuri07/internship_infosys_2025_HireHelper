// controllers/requestController.js
const Request = require("../models/Request");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Send a request for a task
exports.sendRequest = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);

    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    if (task.user.toString() === req.user._id.toString())
      return res
        .status(400)
        .json({ success: false, message: "Cannot request your own task" });

    // Check duplicate
    const existing = await Request.findOne({
      task: taskId,
      requester: req.user._id,
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Request already sent" });

    const request = await Request.create({
      task: taskId,
      requester: req.user._id,
    });

    // Create notification for task owner
    await Notification.create({
      user: task.user,
      body: `New request for your task: ${task.title}`,
    });

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View all requests received (for your tasks)
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("task")
      .populate("requester", "email")
      .where("task.user")
      .equals(req.user._id);

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View all requests sent by you
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id }).populate(
      "task",
      "title location status"
    );

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept or reject a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id).populate("task");

    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    if (request.task.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    request.status = status;
    await request.save();

    await Notification.create({
      user: request.requester,
      body: `Your request for "${request.task.title}" was ${status}`,
    });

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
