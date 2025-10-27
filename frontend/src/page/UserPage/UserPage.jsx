import { useEffect, useState, useRef } from "react"; // Thêm useRef
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import Edit from "../../Components/EditProfile/Edit";
import EditAvt from "../../Components/EditAvatar/EditAvt";
import { BsThreeDots } from "react-icons/bs"; // Thêm icon cho menu 3 chấm

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("thread");
  const [showEdit, setShowEdit] = useState(false);
  const [showEditAvt, setShowEditAvt] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  // Thêm state và ref cho dropdown menu 3 chấm (từ HEAD)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const fetchDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      // console.log(userId);
      if (!userId) {
        console.error("Logged in but userId not found in LocalStorage.");
        toast.error("User session error. Please log in again.");
        return; // Dừng thực thi
      }
      const tempData = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );


      // Lấy logic từ INCOMING
      const islogined = Boolean(localStorage.getItem("isLoggedIn"));
      setIsLogin(islogined);
      setDataUser(tempData.data);

      console.log("Lấy dữ liệu user thành công");
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu user", error);
      toast.error("Cannot get data user");
    }
  };

  //----------------------------------------delete user------------------------------------------------------
  const deleteDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      // console.log(userId);
      if (!userId) {
        console.error("Logged in but userId not found in LocalStorage.");
        toast.error("User session error. Please log in again.");
        return; // Dừng thực thi
      }
      const deleteData = await axios.delete(
        `http://localhost:8080/api/users/${userId}`
      );


      // Lấy logic từ INCOMING

      console.log("Xóa user thành công");
      toast.success("Delete user successfully!");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      navigate("/");
    } catch (error) {
      console.log("Không thể xóa user", error);
      toast.error("Cannot delete user");
    }
  };
  useEffect(() => {
    fetchDataUser();
  }, []);

  useEffect(() => {
    if (isDelete) deleteDataUser();
  }, [isDelete])

  const handleSave = (updatedUser) => {
    setDataUser(updatedUser);
    setShowEdit(false);
  };

  const handleDelete = () => {
    setIsDelete(true);
  };

  // === Mâu thuẫn 1: Lấy logic từ INCOMING ===
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Signed out successfully!");
    navigate("/");
  };


  // === Mâu thuẫn 2: Gộp logic ===
  return (
    <div className="user-page">
      <nav className="nav-bar">
        <h1><span>Profile</span></h1>
        {/* Mình kết hợp logic "isLogin" (từ INCOMING) với cấu trúc menu 3 chấm (từ HEAD)
        vì chỉ nên hiển thị menu khi đã đăng nhập */}
        {isLogin && (
          <div className="menu-wrapper" ref={menuRef}>
            <button className="btn" onClick={() => setMenuOpen(!menuOpen)}>
              <BsThreeDots />
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                {/* Dùng text "Log out" (từ INCOMING) */}
                <button onClick={handleLogout}>Sign out</button>
                <button onClick={handleDelete}>Delete account</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Lấy toàn bộ logic hiển thị còn lại từ INCOMING */}
      {isLogin ? (
        // === PHẦN NÀY DÀNH CHO USER ĐÃ LOGIN (Giữ nguyên) ===
        <>

          {/*------------------------------------thông tin profile----------------------------------------  */}
          <nav className="profile">
            <div className="profile-in4">
              <h1>{dataUser.fullname}</h1>
              <p className="name">@{dataUser.username}</p>
            </div>

            <div className="profile-avt">
              <div className="avatar-wrapper">  {/* Thêm wrapper để chứa cả ảnh và nút chỉnh sửa */}
                <img src={dataUser.userAvatarUrl} alt="avatar" className="avt" />
                <button className="edit-avatar-btn" onMouseDown={() => setShowEditAvt(true)}
                  title="Edit Avatar">
                  ✎
                </button>
              </div>
            </div>

            {/* <nav className="edit-profile-btn"> */}
            <button className="edit-btn" onMouseDown={() => setShowEdit(true)}>
              Edit profile
            </button>
          </nav>

          


          {/*----------------------------------thông tin tab----------------------------------------  */}
          <nav className="tab">
            {["thread", "reply", "media", "repost"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onMouseDown={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>


          {showEdit && (
            <Edit
              user={dataUser}
              onClose={() => setShowEdit(false)}
              onSave={handleSave}
            />
          )}

          {showEditAvt && (
            <EditAvt
              user={dataUser}
              onClose={() => setShowEditAvt(false)}
              onSave={(updatedAvatarUrl) => {
                setDataUser({ ...dataUser, userAvatarUrl: updatedAvatarUrl });
                setShowEditAvt(false);
              }}
            />
          )}

        </>
      ) : (
        // === SỬA ĐỔI: PHẦN NÀY DÀNH CHO USER CHƯA LOGIN ===
        <div className="logged-out-container">
          <h2>Bạn chưa đăng nhập</h2>
          <p>Vui lòng đăng nhập hoặc đăng ký để xem trang cá nhân.</p>
          <div className="auth-buttons">
            <button
              className="auth-btn login-btn"
              onClick={() => navigate("/signin")}
            >
              Đăng nhập
            </button>
            <button
              className="auth-btn register-btn"
              onClick={() => navigate("/signup")}
            >
              Đăng ký
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
