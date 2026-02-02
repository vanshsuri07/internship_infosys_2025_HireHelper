import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import "./Settings.css";
import { useAuth } from "../context/AuthContext";
import { API_PATHS } from "../api/apipath";
import axios from "axios";

// API Configuration
const BASE_URL = process.env.REACT_APP_API_URL;

function Settings() {
  // Auth state - replace with your actual auth context
  const { user, setUser } = useAuth();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [changes, setChanges] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change state

  const [passwordLoading, setPasswordLoading] = useState(false);

  //Watch for user changes to populate form fields
  useEffect(() => {
    const changed =
      firstName !== user?.firstName ||
      lastName !== user?.lastName ||
      email !== user?.email ||
      phone !== user?.phone ||
      bio !== user?.bio ||
      profileImage !== null ||
      imagePreview !== user?.profileImageUrl;

    setChanges(changed);
  }, [
    firstName,
    lastName,
    email,
    phone,
    bio,
    profileImage,
    imagePreview,
    user,
  ]);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setImagePreview(user.profileImageUrl || null);
    }
  }, [user]);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fix for AuthContext destructuring - at the top of the component
  // Replace these two lines:
  // const { user } = useAuth();
  // const { setUser } = useAuth();
  // With this single line:
  // const { user, setUser } = useAuth();

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);

      formData.append("phone", phone);
      formData.append("bio", bio);

      if (profileImage) {
        formData.append("profileImage", profileImage); // MUST MATCH multer.single("profileImage")
      }

      const res = await axios.patch(API_PATHS.AUTH.UPDATE_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle image removal with backend API call
  const handleRemoveImage = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token missing");

      const formData = new FormData();
      formData.append("removeProfileImage", "true");

      const res = await axios.patch(API_PATHS.AUTH.UPDATE_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.data);
      setProfileImage(null);
      setImagePreview(null);
      setSuccess("Profile image removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove image");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordReset = async () => {
    setPasswordLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BASE_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess("Password reset link sent to your email! Check your inbox.");

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-container">
      {/* Alert Messages */}
      {error && (
        <div className="alert alert-error">
          <span>❌ {error}</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓ {success}</span>
          <button onClick={() => setSuccess("")}>✕</button>
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="settings-section">
        <h3>Profile Picture</h3>
        <div className="profile-pic-area">
          <div
            className="avatar-preview"
            onClick={() => imagePreview && setShowImageModal(true)}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="clickable-image"
              />
            ) : (
              <div className="profile-initials">
                {user?.firstName?.[0]?.toUpperCase() || ""}
                {user?.lastName?.[0]?.toUpperCase() || ""}
              </div>
            )}
          </div>
          <div className="pic-actions">
            <label className="change-photo-btn">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
            <button
              type="button"
              className="remove-photo-btn"
              onClick={handleRemoveImage}
              disabled={!imagePreview || loading}
            >
              {loading ? <FaSpinner className="spinner" /> : "Remove"}
            </button>
            <span className="file-info">JPG, PNG up to 5MB</span>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="settings-section">
        <h3>Personal Information</h3>
        <div>
          <div className="form-row">
            <div className="form-group half-width">
              <label>First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group half-width">
              <label>Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-group">
            <label>Bio (Optional)</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              maxLength={500}
            />
            <small className="char-count">{bio.length}/500 characters</small>
          </div>

          <button
            onClick={handleSubmit}
            className="save-btn"
            disabled={!changes || loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="settings-section">
        <h3>Account Security</h3>
        <div className="security-row">
          <div className="security-info">
            <label>Password</label>
            <span>••••••••</span>
            <small
              style={{ display: "block", marginTop: "4px", color: "#666" }}
            >
              We'll send a password reset link to {user?.email}
            </small>
          </div>
          <button
            type="button"
            className="change-password-btn"
            onClick={handlePasswordReset}
            disabled={passwordLoading}
          >
            {passwordLoading ? (
              <>
                <FaSpinner className="spinner" /> Sending...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
      {showImageModal && (
        <div
          className="image-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img src={imagePreview} alt="Full View" />
            <button
              className="close-modal"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
