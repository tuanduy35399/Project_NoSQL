import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import Edit from "../../Components/EditProfile/Edit";
import { BsThreeDots } from "react-icons/bs";

export default function UserPage() {
  const [showEdit, setShowEdit] = useState(false);
  const [dataUser, setDataUser] = useState(null); // Bắt đầu là null
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [userBlog, setUserBlogs] = useState([]); // Bắt đầu là mảng rỗng
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const fetchDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      if (!userId) {
        // Nếu không có userId (dù trước đó check login),
        // ta nên coi như chưa login và dừng lại
        setIsLogin(false);
        localStorage.removeItem("isLoggedIn"); // Dọn dẹp
        console.error("User ID not found in LocalStorage.");
        return;
      }

      // Lấy logic từ INCOMING
      const islogined = Boolean(localStorage.getItem("isLoggedIn"));
      setIsLogin(islogined); // Set trạng thái login

      // Nếu không login thì không cần fetch data
      if (!islogined) {
        return;
      }

      const tempData = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
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

  const deleteDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      if (!userId) {
        toast.error("User session error. Please log in again.");
        return;
      }
      await axios.delete(`http://localhost:8080/api/users/${userId}`);

      console.log("Xóa user thành công");
      toast.success("Delete user successfully!");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      setIsLogin(false); // Cập nhật state
      setDataUser(null); // Cập nhật state
      navigate("/");
    } catch (error) {
      console.log("Không thể xóa user", error);
      toast.error("Cannot delete user");
    }
  };

  const getUserPost = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      if (!userId) {
        // Không cần toast vì fetchDataUser đã xử lý
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

  // Tách riêng useEffect cho getUserPost,
  // nó sẽ chạy khi dataUser thay đổi từ null -> object
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

  const handleSave = (updatedUser) => {
    setDataUser(updatedUser);
    setShowEdit(false);
  };

  const handleDelete = () => {
    // Thêm một bước xác nhận
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsDelete(true);
    }
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

  return (
    <div className="user-page">
      <nav className="nav-bar">
        <h1>
          <span>Profile</span>
        </h1>
        {isLogin && (
          <div className="menu-wrapper" ref={menuRef}>
            <button className="btn" onClick={() => setMenuOpen(!menuOpen)}>
              <BsThreeDots />
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Log out</button>
                <button onClick={handleDelete}>Remove account</button>
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
              {/* Chỉ render phần này khi dataUser đã tồn tại */}
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

              <div className="layout">
                {/* SỬA LỖI 2.2: Dùng spread operator ...userBlog */}
                {[...userBlog].reverse().map((post) => (
                  <div key={post.id} className="box">
                    {/* --- Header post --- */}
                    <div className="post-content">
                      <div className="header_post">
                        <div className="avatar_user">
                          <img
                            src={post.userAvatarUrl || "/default-avatar.png"}
                            alt="User Avatar"
                          />
                        </div>
                        <div className="user-box">
                          {post.userName ? "@" + post.userName : "Unknown user"}
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
            </>
          )}
        </>
      ) : (
        // Phần dành cho user chưa login
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
