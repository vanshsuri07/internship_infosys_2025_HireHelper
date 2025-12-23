// routes/notificationRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const Notification = require("../models/Notification");
const { markAsRead } = require("../controllers/notificationController.js");
const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/:id/read", protect, markAsRead);

module.exports = router;
