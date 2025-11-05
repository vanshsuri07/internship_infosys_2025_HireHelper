const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getAllTasks);
router.get("/my", protect, getMyTasks);
router.get("/:id", protect, getTaskById);
router.patch("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
