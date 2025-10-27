import "./EditAvt.css";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

export default function EditAvt({ onClose, currentAvatar, onSave }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

//Hàm chọn ảnh
  const handleAvatarChange = (e) => {
    setSelectedAvatar(e.target.files[0]); // lấy file ảnh
  };

//Hàm submit ảnh lên server
  const handleSubmit = async () => {
    if (!selectedAvatar) {
      toast.error("Vui lòng chọn ảnh!");
      return;
    }

// Lấy username từ localStorage
    const username = localStorage.getItem("username")?.replaceAll('"', "");
    if (!username) {
      toast.error("Không tìm thấy thông tin user. Hãy đăng nhập lại!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedAvatar);

    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/users/${username}/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Cập nhật ảnh đại diện thành công!");
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Không thể cập nhật ảnh đại diện!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="edit-avt-modal">


        <div className="edit-header">
          <h2>Edit Avatar</h2>
          <button className="close-icon" onClick={onClose}>×</button>
        </div>
        <div className="edit-bottom">
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>

           </div>
        </div>
         
    </div>
  );
}
