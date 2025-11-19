const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOTPEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // not verified

        const otp = generateOTP();
        await Otp.deleteMany({ email });
        await new Otp({ email, otp }).save();
        await sendOTPEmail(email, otp);

        return res.status(200).json({
          message:
            "User already registered, OTP sent to email for verification",
          requiresVerification: true,
          email: email,
        });
      }
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      isVerified: false,
    });

    const otp = generateOTP();
    await Otp.deleteMany({ email });
    await new Otp({ email, otp }).save();

    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(201).json({
      message:
        "User registered successfully, OTP sent to email for verification",
      requiresVerification: true,
      email: email,
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// verify Email
// verifyEmail controller
exports.verifyEmail = async (req, res) => {
  const { otp } = req.body;

  // ✅ Only OTP is required now
  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    // Find OTP document
    const otpDoc = await Otp.findOne({ otp }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find the corresponding user
    const user = await User.findOne({ email: otpDoc.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent double verification
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Mark OTP as used and delete it
    await Otp.deleteOne({ _id: otpDoc._id });

    // Send success response
    res.status(200).json({
      message: "Email verified successfully! You can now login",
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resend Otp
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    await Otp.deleteMany({ email });
    await new Otp({ email, otp }).save();

    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({
      message: "New OTP sent to your email",
      email: email,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        requiresVerification: true,
        email: user.email,
      });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    await Otp.deleteMany({ email });
    await new Otp({ email, otp }).save();

    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      message: "OTP sent successfully",
      email: email,
    });
  } catch (error) {
    console.log("Forget Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP and reset password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    // verify otp
    const otpDoc = await Otp.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP is expired
    if (otpDoc.verified) {
      return res.status(400).json({ message: "OTP has already been used" });
    }

    // Reset password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    // Delete OTP
    await Otp.deleteOne({ _id: otpDoc._id });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Reset Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
