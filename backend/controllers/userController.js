const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOTPEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/emailService2");
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
  const { firstName, lastName, email, phone, password, profileImageUrl } =
    req.body;

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
      profileImageUrl,
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
  console.log("📩 Incoming Login Request:", { email, password });
  if (!email || !password) {
    console.log("❌ Missing fields:", { email, password });
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("🔍 Searching user by email...");

    if (!user || !(await user.comparePassword(password))) {
       console.log("❌ No user found with email:", email);
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

// Forgot Password - Send reset link
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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Update user with reset token fields using updateOne (bypasses validation)
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpire: Date.now() + 60 * 60 * 1000, // 1 hour
        },
      }
    );

    // Send email with plain token
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (!emailResult.success) {
      // Clean up token if email fails
      await User.updateOne(
        { _id: user._id },
        {
          $unset: {
            resetPasswordToken: "",
            resetPasswordExpire: "",
          },
        }
      );

      return res.status(500).json({
        message: "Failed to send password reset email. Please try again.",
      });
    }

    res.status(200).json({
      message: "Password reset link sent to your email",
      email: email,
    });
  } catch (error) {
    console.log("Forgot Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify token and reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  // Validate password strength
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    // Hash the token from request to match with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password - this will trigger the pre-save hash middleware
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Use validateModifiedOnly to avoid validating unchanged required fields
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Reset Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Verify token validity before showing reset form
exports.verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        valid: false,
        message: "Invalid or expired reset token",
      });
    }

    res.status(200).json({
      valid: true,
      message: "Token is valid",
      email: user.email, // Optional: return email to show on reset form
    });
  } catch (error) {
    console.log("Verify Token error:", error);
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
