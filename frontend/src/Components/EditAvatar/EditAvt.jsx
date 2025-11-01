import "./EditAvt.css";
import axios from "axios";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { CloudCog } from "lucide-react";

export default function EditAvt({ onClose, currentAvatar, onSave }) {
  // State để lưu file ảnh và URL preview
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); //lấy dữ liệu đã chuyển thành url để hiển thị preview 
  const fileInputRef = useRef(null); //để có thể reset input sau khi xóa file
  // const [isLoggedIn, setIsLogin] = useState(false);
  // const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(false);


  const deleteAvatar = async () => {
    const loadingToast = toast.loading("Deleting...");
    try {
      await axios.delete(`http://localhost:8080/api/users/${storedUserId}/avatar`);
      console.log("Avatar deleted successfully");
      toast.success("Avatar deleted successfully!", { id: loadingToast });
      if (onSave) {
        onSave(null); //gọi onSave với null để xóa avatar ở component cha
        onClose();
      }
    }catch (error){
      toast.error("Delete failed!", { id: loadingToast });
    }
  };

  //để khi mở edit avatar sẽ có avt hiện tại 
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  //Chọn file - hiển thị preview
  const handleFileChange = (e) => {
    const file = e.target.files[0]; //lấy file đầu tiên
    if (file) {
      setAvatarFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); //thu hồi URL cũ nếu có
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = ""; // reset input file để chọn lại được cùng file nếu cần
  }

  //Xóa file 
  const handleRemoveImage = () => {
    setAvatarFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); //thu hồi URL cũ nếu có
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //Kiểm tra trạng thái đăng nhập
  // const checkLogin = async () => {
  //   const login = localStorage.getItem("isLoggedIn"); //cập nhật trạng thái đăng nhập
  //   setIsLogin(login);
  // };

  //Chạy kiểm tra đăng nhập khi component mount
  // useEffect(() => {
  //   checkLogin();
  // }, []);

  //Hàm submit file ảnh lên server
  const handleSubmit = async () => {
    const loadingToast = toast.loading("Updating...");
    if (!avatarFile) {
      toast.error("Please choose a image!");
      return;
    }
    // Lấy userId từ localStorage
    const storedUserId = localStorage.getItem("userId")?.replaceAll('"', "");

    // formData để gửi file
    const formData = new FormData();
    formData.append("file", avatarFile);

    // Gửi yêu cầu POST lên server
    try {
      setLoading(true);
      const response = await axios.patch(`http://localhost:8080/api/users/${storedUserId}/avatar`, formData, { //lấy tạm api post blogs để test
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar updated successfully!", { id: loadingToast });

      //lưu lại URL ảnh mới sau khi upload thành công
      if (onSave) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      toast.error("Upload failed!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="edit-avt-modal">

        {/* Tiêu đề */}
        <div className="edit-header">
          <h2>Edit Avatar</h2>
        </div>
        <button className="close-icon" onClick={onClose}>×</button>

        {/* Đầu vào cho file ảnh */}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Hiển thị preview và nút remove */}
        <label htmlFor="fileInput" className="upload-button">
          {previewUrl ? (
            // Nếu có ảnh preview, thì hiển thị ảnh
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="avatar-preview"
            />
          ) : currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Current Avatar"
              className="avatar-preview"
            />
          ) : (
            // Nếu không có ảnh preview, hiển thị avatar hiện tại hoặc placeholder
            <div className="avatar-placeholder">Avatar</div>
          )}
        </label>

        {/* Tách ra khỏi header cho đúng cấu trúc */}
        <div className="modal-actions">
          {/* {previewUrl && ( */}
          <button 
            onClick={deleteAvatar} 
            // disabled={!avatarFile || loading}  
            className="remove-btn">
            Remove
          </button>
          {/* )} */}
          <button
            onClick={handleSubmit}
            disabled={!avatarFile || loading}
            className="save-btn"
          > Save Change
            {/* {loading ? "Saving..." : "Save Changes"} */}
          </button>
        </div>
      </div>
    </div>
  );
}
