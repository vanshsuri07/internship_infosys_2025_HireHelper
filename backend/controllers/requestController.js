// controllers/requestController.js
const Request = require("../models/Request");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Send a request for a task
exports.sendRequest = async (req, res) => {
  try {
    const { taskId, message } = req.body;

    if (!message)
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });

    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    if (task.user.toString() === req.user._id.toString())
      return res
        .status(400)
        .json({ success: false, message: "You cannot request your own task" });

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
      message,
    });

    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View all requests received
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate({
        path: "task",
        match: { user: req.user._id }, // filter right here
        select: "title description picture location start_time end_time user",
        populate: {
          path: "user",
          select: "firstName lastName email profileImageUrl",
        },
      })
      .populate("requester", "firstName lastName email profileImageUrl");

    const filtered = requests.filter((r) => r.task !== null);

    res.json({ success: true, requests: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View all requests sent by you
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate({
        path: "task",
        select:
          "title category description picture location start_time end_time status user",

        populate: {
          path: "user",
          select: "firstName lastName profileImageUrl email",
        },
      })
      .populate("requester", "firstName lastName email profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, requests });
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
