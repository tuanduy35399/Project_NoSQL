import { useEffect, useState, useRef } from "react"; // Thêm useRef
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import Edit from "../../Components/EditProfile/Edit";
import { BsThreeDots } from "react-icons/bs"; // Thêm icon cho menu 3 chấm

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("thread");
  const [showEdit, setShowEdit] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchDataUser();
  }, []);

  const handleSave = (updatedUser) => {
    setDataUser(updatedUser);
    setShowEdit(false);
  };

  // === Mâu thuẫn 1: Lấy logic từ INCOMING ===
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // === Mâu thuẫn 2: Gộp logic ===
  return (
    <div className="user-page">
      {/* Lấy nav-bar từ HEAD (menu 3 chấm) */}
      <nav className="nav-bar">
        <h1>
          <span>Profile</span>
        </h1>
        {/* Mình kết hợp logic "isLogin" (từ INCOMING) 
                  với cấu trúc menu 3 chấm (từ HEAD)
                  vì chỉ nên hiển thị menu khi đã đăng nhập 
                */}
        {isLogin && (
          <div className="menu-wrapper" ref={menuRef}>
            <button className="btn" onClick={() => setMenuOpen(!menuOpen)}>
              <BsThreeDots />
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                {/* Dùng text "Log out" (từ INCOMING) */}
                <button onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Lấy toàn bộ logic hiển thị còn lại từ INCOMING */}
      {isLogin ? (
        // === PHẦN NÀY DÀNH CHO USER ĐÃ LOGIN (Giữ nguyên) ===
        <>
          <nav className="profile">
            <div className="profile-in4">
              <h1>{dataUser.fullname}</h1>
              <p className="name">@{dataUser.username}</p>
            </div>

            <div className="profile-avt">
              <img src={dataUser.userAvatarUrl} alt="avatar" className="avt" />
              <button
                className="edit-btn"
                onMouseDown={() => setShowEdit(true)}
              >
                Edit profile
              </button>
            </div>
          </nav>
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
