const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");

const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
} = require("../controllers/requestController.js");

const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/received", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);
router.patch("/:id", protect, updateRequestStatus);

module.exports = router;
