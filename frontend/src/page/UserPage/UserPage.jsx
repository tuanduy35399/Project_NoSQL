import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import "./UserPage.css";
import Edit from "../../Components/EditProfile/Edit";
export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const [showEdit, setShowEdit] = useState(false);
    const [dataUser, setDataUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    
    const fetchDataUser = async () => {
        try {
            const userId = String(localStorage.getItem("userId")).replaceAll('"', ''); 
            // console.log(userId);
            if (!userId) {
              console.error("Logged in but userId not found in LocalStorage.");
              toast.error("User session error. Please log in again.");
              return; // Dừng thực thi
            }
            const tempData = await axios.get(
              `http://localhost:8080/api/users/${userId}`
            );
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

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        toast.success("Logged out successfully!");
        navigate("/");
    };
    return (
      <div className="user-page">
        <nav className="nav-bar">
          <h1>
            <span>Profile</span>
          </h1>
          {isLogin && (
            <div className="menu-wrapper">
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Log out</button>
              </div>
            </div>
          )}
        </nav>
            {isLogin ? //TH1: Ng dung da dang nhap va da load du lieu thanh cong 
                (
          <>
            <nav className="profile">
              <div className="profile-in4">
                <h1>{dataUser.fullname}</h1>
                <p className="name">@{dataUser.username}</p>
              </div>

              <div className="profile-avt">
                <img
                  src={dataUser.userAvatarUrl}
                  alt="avatar"
                  className="avt"
                />
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
        ) : // Trường hợp 2: Ng dung da dang nhap nhung dang load du lieu 
        !dataUser ? (
          <p>Loading profile...</p>
        ) : (
          // Trường hợp 3: Người dùng CHƯA đăng nhập
          <>
            <h2>You need to Login</h2>
          </>
        )}
      </div>
    );
}
