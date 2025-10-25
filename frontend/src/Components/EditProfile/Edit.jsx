import { useState } from "react";
import "./Edit.css";

export default function Edit({ user, onClose, onSave }) {
<<<<<<< HEAD
  const [formData, setFormData] = useState(user); // lấy dữ liệu từ props
=======
  const [formData, setFormData] = useState(user);
>>>>>>> 5bb1891c700b782888e80662404ed7b6447ff81c

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
<<<<<<< HEAD
    if (onSave) onSave(formData); // gửi dữ liệu mới về UserPage
=======
    if (onSave) onSave(formData); 
>>>>>>> 5bb1891c700b782888e80662404ed7b6447ff81c
  };

  return (
    <div className="overlay">
      <div className="edit-modal">
        {/* Header */}
        <div className="edit-header">
          <h2>Edit Profile</h2>
          <button className="close-icon" onClick={onClose}>×</button>
        </div>

        {/* Full Name */}
        <div className="profile-field">
          <label className="profile-label">Full Name</label>
          <input
            type="text"
            value={formData.fullname}
            onChange={(e) => handleChange("fullname", e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Username */}
        <div className="profile-field">
          <label className="profile-label">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Bio */}
        <div className="profile-field">
          <label className="profile-label">Bio</label>
          <textarea
            placeholder="Write biography"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="profile-textarea"
          />
        </div>

        {/* Link */}
        <div className="profile-field">
          <label className="profile-label">Link</label>
          <input
            placeholder="Add link"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Button */}
        <button className="profile-button" onClick={handleSubmit}>
          Done
        </button>
      </div>
    </div>
  );
}
