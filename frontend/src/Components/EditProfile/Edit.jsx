import { useState } from "react";
import "./Edit.css";
import axios from "axios";
import { toast } from "sonner";

export default function Edit({ user, onClose, onSave }) {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', ""); 
      if (!userId) {
        console.error("Logged in but userId not found in LocalStorage.");
        toast.error("User session error. Please log in again.");
        return; // Dừng thực thi
      }
      //doi Hieu Nhan viet API response de lay id tu localStorage 

      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Profile updated successfully!");
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="edit-modal">
        <div className="edit-header">
          <h2>Edit Profile</h2>
          <button className="close-icon" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="profile-field">
          <label className="profile-label">Full Name</label>
          <input
            type="text"
            value={formData.fullname || ""}
            onChange={(e) => handleChange("fullname", e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="profile-field">
          <label className="profile-label">Username</label>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
            className="profile-input"
          />
        </div>

        {/* <div className="profile-field">
          <label className="profile-label">Bio</label>
          <textarea
            placeholder="Write biography"
            value={formData.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="profile-textarea"
          />
        </div> */}

        {/* <div className="profile-field">
          <label className="profile-label">Link</label>
          <input
            placeholder="Add link"
            value={formData.link || ""}
            onChange={(e) => handleChange("link", e.target.value)}
            className="profile-input"
          />
        </div> */}

        <button
          className="profile-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Done"}
        </button>
      </div>
    </div>
  );
}
