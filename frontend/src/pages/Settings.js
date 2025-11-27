import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';
import { FaUserCircle } from 'react-icons/fa';

function Settings() {
  const { user } = useAuth();
  
  // State for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  
  // State for profile picture
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      // If user has a saved picture, we would load it here
      // setImagePreview(user.picture); 
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        alert("File is too large. Please choose an image under 5MB.");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Saving settings...", { firstName, lastName, email, phone, bio, profileImage });
    alert("Changes saved (Frontend Demo)");
  };

  return (
    <div className="settings-container">


      <div className="settings-section">
        <h3>Profile Picture</h3>
        <div className="profile-pic-area">
          <div className="avatar-preview">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" />
            ) : (
              <FaUserCircle className="default-avatar" />
            )}
          </div>
          <div className="pic-actions">
            <label className="change-photo-btn">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            <button type="button" className="remove-photo-btn" onClick={handleRemovePhoto}>
              Remove
            </button>
            <span className="file-info">JPG, PNG up to 5MB</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Personal Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half-width">
              <label>First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
              />
            </div>
            <div className="form-group half-width">
              <label>Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
            />
          </div>

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>

      <div className="settings-section">
        <h3>Account Security</h3>
        <div className="security-row">
          <div className="security-info">
            <label>Password</label>
            <span>Last updated 3 months ago</span>
          </div>
          <button type="button" className="change-password-btn">Change Password</button>
        </div>
      </div>

    </div>
  );
}

export default Settings;