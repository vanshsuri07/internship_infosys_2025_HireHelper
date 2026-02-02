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

    // Get profile image URL from uploaded file or use default
    let profileImageUrl = "";
    if (req.file) {
      profileImageUrl = req.file.path; // Cloudinary URL
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

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    const otpDoc = await Otp.findOne({ otp }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email: otpDoc.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ _id: otpDoc._id });

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

// Resend OTP
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpire: Date.now() + 60 * 60 * 1000,
        },
      }
    );

    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (!emailResult.success) {
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

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Reset Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify token validity before showing reset form
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
      email: user.email,
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

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["firstName", "lastName", "email", "phone", "bio"];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      updates.profileImageUrl = req.file.path; // Cloudinary URL
    }

    // Handle profile image removal
    if (req.body.removeProfileImage === "true") {
      updates.profileImageUrl = "";
    }

    if (
      Object.keys(updates).length === 0 &&
      !req.file &&
      req.body.removeProfileImage !== "true"
    ) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
