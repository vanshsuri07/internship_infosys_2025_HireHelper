const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");

const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
} = require("../controllers/requestController.js");

const router = express.Router();

router.post("/", protect, sendRequest); // Send request for a task
router.get("/received", protect, getReceivedRequests); // Requests for my tasks
router.get("/sent", protect, getSentRequests); // Requests I sent
router.patch("/:id", protect, updateRequestStatus); // Accept/reject request

module.exports = router;
