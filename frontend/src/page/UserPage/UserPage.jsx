import { useEffect, useState, useRef } from "react"; // Thêm useRef
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import Edit from "../../Components/EditProfile/Edit";
import EditAvt from "../../Components/EditAvatar/EditAvt";
import { BsThreeDots } from "react-icons/bs"; // Thêm icon cho menu 3 chấm
import { Button } from "@/Components/ui/button";
import { use } from "react";


export default function UserPage() {
  const [activeTab, setActiveTab] = useState("thread");
  const [showEdit, setShowEdit] = useState(false);
  const [showEditAvt, setShowEditAvt] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [userBlog, setUserBlogs] = useState([]); // Bắt đầu là mảng rỗng
  


  // Thêm state và ref cho dropdown menu 3 chấm (từ HEAD)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const fetchDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      // console.log(userId);
      if (!userId) {
        setIsLogin(false);
        localStorage.removeItem("isLoggedIn"); // Dọn dẹp
        console.error("User ID not found in LocalStorage.");
        return;
      }
      const tempData = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      // Lấy logic từ INCOMING
      const islogined = Boolean(localStorage.getItem("isLoggedIn"));
      setIsLogin(islogined); // Set trạng thái login
      // Nếu không login thì không cần fetch data
      if (!islogined) {
        return;
      }
      setDataUser(tempData.data);
      console.log("Lấy dữ liệu user thành công");
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu user", error);
      toast.error("Cannot get data user");

      // Nếu lỗi (ví dụ: user bị xóa, token hết hạn), đăng xuất user
      setIsLogin(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
    }
  };

//----------------------------------------delete user------------------------------------------------------
  const deleteDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      if (!userId) {
        //console.error("Logged in but userId not found in LocalStorage.");
        toast.error("User session error. Please log in again.");
        return; // Dừng thực thi
      }
      // Lấy logic từ INCOMING
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
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

  //----------------------------------------get user post------------------------------------------------------
  const getUserPost = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      if (!userId) {
        return;
      }
      const blogs = await axios.get(
        `http://localhost:8080/api/v1/blogs/${userId}/all`
      );

      // SỬA LỖI 2.1: Giả sử blogs.data là một mảng. Không bọc nó trong [].
      if (Array.isArray(blogs.data)) {
        setUserBlogs(blogs.data);
      } else {
        // Nếu API trả về cấu trúc lạ, set mảng rỗng để tránh crash
        setUserBlogs([]);
        console.warn("Expected an array of blogs, but received:", blogs.data);
      }
      console.log("Lay bai viet user thanh cong");
    } catch (error) {
      console.log("Khong the lay cai bai post cua user", error);
      toast.error("Cannot get user's blogs");
    }
  };

  useEffect(() => {
    // Chỉ gọi getUserPost KHI ĐÃ CÓ dataUser
    // Điều này đảm bảo chúng ta chỉ fetch post khi đã login thành công
    const init = async () => {
      await fetchDataUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (dataUser && isLogin) {
      getUserPost();
    }
  }, [dataUser, isLogin]); // Phụ thuộc vào dataUser và isLogin

  useEffect(() => {
    if (isDelete) {
      deleteDataUser();
      setIsDelete(false); // Reset lại state sau khi gọi
    }
  }, [isDelete]); // Xóa mảng phụ thuộc [deleteDataUser] để tránh vòng lặp vô hạn

//---------------------------------------Các hàm xử lý--------------------------------------------------     

  const handleSave = (updatedUser) => {
    setDataUser(updatedUser);
    setShowEdit(false);
    setShowEditAvt(false);
  };

  const handleDelete = () => {
    // Thêm một bước xác nhận
    if (window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )) 
    {setIsDelete(true);}
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    setIsLogin(false);
    setDataUser(null);
    setUserBlogs([]); // Xóa các bài post khỏi state
    toast.success("Signed out successfully!");
    navigate("/");
  };

  const handleDeletePost = async (blogId) => {
    const loadingToast= toast.loading("Deleting...")
    try {
      await axios.delete(`http://localhost:8080/api/v1/blogs/${blogId}`);
      console.log("Xoa blog thanh cong");
      toast.success("Delete blog successful", { id: loadingToast });
      setUserBlogs((currentBlogs) =>
        currentBlogs.filter((blog) => blog.id !== blogId)
      );
    } catch (error) {
      console.log("Khong the xoa blog", error);
      toast.error("Cannot delete blog", { id: loadingToast });
    } 
  };

  const handleAvatarUpdate = (newUserData) => {
  setDataUser(newUserData);   // ✅ Dùng đúng state
};
  return (
    <div className="user-page">
      <nav className="nav-bar">
        <h1>
          <span>Profile</span>
        </h1>
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
                <Button onClick={handleLogout} className="signout-btn">
                  Sign out
                </Button>
                <Button onClick={handleDelete} className="deleteacc-btn">
                  Delete account
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>

      {isLogin ? (
        <>
          {/* SỬA LỖI 1: Thêm kiểm tra loading state */}
          {!dataUser ? (
            <div className="loading-container">
              <p>Loading profile...</p>
            </div>
          ) : (
            <>
              {/*----------------------------------thông tin profile----------------------------------------  */}
              <nav className="profile">
                <div className="profile-in4">
                  <h1>{dataUser.fullname}</h1>
                  <p className="name">@{dataUser.username}</p>
                </div>
                <div className="profile-avt">
                  <div className="avatar-wrapper">
                    {" "}
                    {/* Thêm wrapper để chứa cả ảnh và nút chỉnh sửa */}
                    <img
                      src={dataUser.userAvatarUrl}
                      alt="avatar"
                      className="avt"
                    />
                    <button
                      className="edit-avatar-btn"
                      onMouseDown={() => setShowEditAvt(true)}
                      title="Edit Avatar"
                    >
                      ✎
                    </button>
                  </div>
                </div>
                <button
                  className="edit-btn"
                  onMouseDown={() => setShowEdit(true)}
                >
                  Edit profile
                </button>
              </nav>

              {/*----------------------------------thông tin tab----------------------------------------  */}
              {/* <nav className="tab">
                {["thread", "reply", "media", "repost"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                    onMouseDown={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav> */}
              
              {/* -----------------------------Hiện bài đăng--------------------------------------------- */}
              <div className="layout">
                {/* SỬA LỖI 2.2: Dùng spread operator ...userBlog */}
                {[...userBlog].reverse().map((post) => (
                  <div key={post.id} className="box">
                    {/* --- Header post --- */}
                    <div className="post-content">
                      <div className="header_post">
                        <div className="avatar_mini_wrapper">
                          <img
                            src={post.userAvatarUrl || "/default-avatar.png"}
                            alt="User Avatar"
                            className="avatar"
                          />
                        </div>
                        <div className="user-box">
                          {post.username ? "@" + post.username : "Unknown user"}
                        </div>
                      </div>
                    </div>

                    <div className="desc-box">{post.content}</div>

                    {Array.isArray(post.imageContentUrls) &&
                      post.imageContentUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="picture"
                          alt={`Post image ${index}`}
                        />
                      ))}

                    <span
                      style={{ color: "grey", fontSize: 13, opacity: "70%" }}
                    >
                      {new Date(post.createdAt).toLocaleString("vi-VN", {
                        hour12: false,
                      })}
                    </span>
                    <div className="modifileButton">
                      <Button className="w-26 bg-black cursor-pointer">
                        Update
                      </Button>
                      <Button
                        className="w-26 bg-black cursor-pointer"
                        onClick={()=>handleDeletePost(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

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
                  currentAvatar={dataUser.userAvatarUrl}
                  onClose={() => setShowEditAvt(false)}
                  onSave={handleAvatarUpdate}   // ✅ callback đúng
                />
              )}
            </>
          )}
        </>
      ) : (
    
        //---------------------------------SỬA ĐỔI: PHẦN NÀY DÀNH CHO USER CHƯA LOGIN------------------------------
        <div className="logged-out-container">
          <h2>You are not signed in</h2>
          <p>Please sign in or sign up to view your profile.</p>
          {/* <div className="auth-buttons">
            <button
              className="auth-btn login-btn"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </button>
            <button
              className="auth-btn register-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}
