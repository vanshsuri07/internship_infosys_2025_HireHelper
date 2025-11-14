const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  getUserInfo,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
