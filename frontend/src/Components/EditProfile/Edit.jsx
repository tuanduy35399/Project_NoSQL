import { useState } from "react";
import "./Edit.css"; // import CSS riêng

export default function Edit() {
  const [formData, setFormData] = useState({
    name: "Hiếu Nhân (@hn6_4)",
    bio: "",
    interest: "",
    link: ""
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Submitted:", formData, { showInstagram, isPrivate });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Name */}
        <div className="profile-field">
          <label className="profile-label">Tên</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Bio */}
        <div className="profile-field">
          <label className="profile-label">Tiểu sử</label>
          <textarea
            placeholder="+ Viết tiểu sử"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="profile-textarea"
          />
        </div>

        {/* Link */}
        <div className="profile-field">
          <label className="profile-label">Liên kết</label>
          <input
            placeholder="+ Thêm liên kết"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Button */}
        <button className="profile-button" onClick={handleSubmit}>
          Xong
        </button>
      </div>
    </div>
  );
}
