import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";
import Edit from "../../Components/EditProfile/Edit";
import EditAvt from "../../Components/EditAvatar/EditAvt";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontalIcon, UploadIcon } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("thread");
  const [showEdit, setShowEdit] = useState(false);
  const [showEditAvt, setShowEditAvt] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [userBlog, setUserBlogs] = useState([]);
  const [editingContent, setEditingContent] = useState("");
  const [editingImage, setEditingImage] = useState([]); // Đây là mảng ảnh CŨ (URL)
  const [publish, setPublish] = useState(true);
  const [newImages, setNewImages] = useState([]); // Đây là mảng ảnh MỚI (File)
  const fileInputRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const fetchDataUser = async () => {
    try {
      const userId = String(localStorage.getItem("userId")).replaceAll('"', "");
      if (!userId) {
        setIsLogin(false);
        localStorage.removeItem("isLoggedIn");
        console.error("User ID not found in LocalStorage.");
        return;
      }
      const tempData = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      const islogined = Boolean(localStorage.getItem("isLoggedIn"));
      setIsLogin(islogined);
      if (!islogined) {
        return;
      }
      setDataUser(tempData.data);
      console.log("Lấy dữ liệu user thành công");
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu user", error);
      toast.error("Cannot get data user");
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
        toast.error("User session error. Please log in again.");
        return;
      }
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

      if (Array.isArray(blogs.data)) {
        setUserBlogs(blogs.data);
      } else {
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
    const init = async () => {
      await fetchDataUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (dataUser && isLogin) {
      getUserPost();
    }
  }, [dataUser, isLogin]);

  useEffect(() => {
    if (isDelete) {
      deleteDataUser();
      setIsDelete(false);
    }
  }, [isDelete]);

  //---------------------------------------Các hàm xử lý--------------------------------------------------

  const handleSave = (updatedUser) => {
    setDataUser(updatedUser);
    setShowEdit(false);
    setShowEditAvt(false);
  };

  // Xóa ảnh CŨ (URL)
  const handleRemoveImage = (index) => {
    const newFiles = [...editingImage];
    newFiles.splice(index, 1);
    setEditingImage(newFiles);
  };

  // Xóa ảnh MỚI (File)
  const handleRemoveNewImage = (index) => {
    const updatedFiles = [...newImages];
    updatedFiles.splice(index, 1);
    setNewImages(updatedFiles);
  };

  // Xử lý chọn file MỚI (Logic "ghi đè")
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Chỉ ghi đè khi người dùng thực sự chọn file mới
    if (files.length > 0) {
      setNewImages(files);
      setEditingImage([]); // GHI ĐÈ: Xóa danh sách ảnh cũ
    }
  };

  const handleDelete = () => {
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
    setUserBlogs([]);
    toast.success("Signed out successfully!");
    navigate("/");
  };

  const handleDeletePost = async (blogId) => {
    const loadingToast = toast.loading("Deleting blog...");
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

  // Hàm Update Post đã bao gồm logic gửi ảnh mới và xóa ảnh cũ
  const handleUpdatePost = async (blogId, originalImageUrls) => {
    const loadingToast = toast.loading("Updating post...");
    try {
      const formData = new FormData();
      formData.append("blogId", blogId);
      formData.append("content", editingContent);
      

      // 1. Gửi các URL ảnh CŨ bị xóa
      // Do logic "ghi đè", editingImage sẽ là mảng rỗng nếu có ảnh mới
      const removedUrls = originalImageUrls.filter(
        (originalUrl) => !editingImage.includes(originalUrl)
      );
      removedUrls.forEach((url) => {
        formData.append("removeImagesUrl", url);
      });

      // 2. Gửi các file ảnh MỚI
      newImages.forEach((file) => {
        formData.append("newImages", file);
      });

      // 3. Gửi request
      await axios.patch("http://localhost:8080/api/v1/blogs-details", formData);
      await axios.patch(
        "http://localhost:8080/api/v1/blogs/access",
        {
          blogId: blogId,
          published: publish
        }
      );
      console.log("Cap nhat blog thanh cong");
      toast.success("Update post successful", { id: loadingToast });

      // 4. Tải lại danh sách post để có dữ liệu mới nhất từ server
      getUserPost();
      // Bỏ cách cập nhật state local cũ đi, gọi API luôn cho chính xác

      // 5. Reset state
      setNewImages([]);
    } catch (error) {
      console.log("Khong the cap nhat blog", error);
      toast.error("Cannot update post", { id: loadingToast });
    }
  };

  const handleAvatarUpdate = (newUserData) => {
    setDataUser(newUserData);
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

              {/*---------------------------------- layout ----------------------------------------  */}
              <div className="layout">
                {[...userBlog].reverse().map((post) => (
                  <div key={post.id} className="box">
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
                        <div className="modifileButton">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                aria-label="Open menu"
                                size="icon-sm"
                              >
                                <MoreHorizontalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="end">
                              <DropdownMenuGroup>
                                {/* ------------------- UPDATE DIALOG ------------------- */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        setEditingContent(post.content);
                                        setEditingImage(post.imageContentUrls);
                                        setPublish(post.published || true);
                                        setNewImages([]); // Reset ảnh mới
                                      }}
                                    >
                                      <span>Update</span>
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Update post
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Make changes to your post and upload new
                                        images.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    {/* PHẦN NỘI DUNG CUỘN */}
                                    <div className="flex-1 min-h-0 overflow-y-auto pr-4">
                                      <FieldGroup className="py-3">
                                        <Field>
                                          <Textarea
                                            id="content"
                                            name="content"
                                            value={editingContent}
                                            onChange={(e) =>
                                              setEditingContent(e.target.value)
                                            }
                                          />

                                          {/* LOGIC HIỂN THỊ "GHI ĐÈ" */}
                                          {newImages.length > 0 ? (
                                            <>
                                              <FieldLabel>
                                                New Images
                                              </FieldLabel>
                                              <div className="image-preview-container">
                                                {newImages.map(
                                                  (file, index) => (
                                                    <div
                                                      key={index}
                                                      className="previewWrapper"
                                                    >
                                                      <img
                                                        src={URL.createObjectURL(
                                                          file
                                                        )}
                                                        className="previewImage"
                                                        alt={file.name}
                                                      />
                                                      <button
                                                        type="button"
                                                        className="removeButton"
                                                        onClick={() =>
                                                          handleRemoveNewImage(
                                                            index
                                                          )
                                                        }
                                                      >
                                                        ✕
                                                      </button>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div className="image-preview-container">
                                                {Array.isArray(editingImage) &&
                                                  editingImage.map(
                                                    (url, index) => (
                                                      <div
                                                        key={index}
                                                        className="previewWrapper"
                                                      >
                                                        <img
                                                          src={url}
                                                          className="previewImage"
                                                        />
                                                        <button
                                                          type="button"
                                                          className="removeButton"
                                                          onClick={() =>
                                                            handleRemoveImage(
                                                              index
                                                            )
                                                          }
                                                        >
                                                          ✕
                                                        </button>
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                            </>
                                          )}
                                          {/* KẾT THÚC LOGIC "GHI ĐÈ" */}
                                        </Field>
                                      </FieldGroup>
                                    </div>

                                    <AlertDialogFooter>
                                      <div className="flex-1 flex-row justify-between gap-2.5">
                                        <div className="flex items-center gap-2.5">
                                          <Select
                                            onValueChange={(value) => {
                                              setPublish(value === "true");
                                            }}
                                            defaultValue={String(publish)}
                                          >
                                            <SelectTrigger className="w-[120px] border-accent-foreground cursor-pointer">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="true">
                                                <span>Publish</span>
                                              </SelectItem>
                                              <SelectItem value="false">
                                                <span>Private</span>
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <label
                                            htmlFor="fileInput"
                                            className="group cursor-pointer rounded-lg border flex items-center justify-center bg-white shadow-sm transition-all h-10 w-10"
                                          >
                                            <UploadIcon />
                                          </label>
                                          <input
                                            id="fileInput"
                                            type="file"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                          />
                                        </div>
                                      </div>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleUpdatePost(
                                            post.id,
                                            post.imageContentUrls
                                          )
                                        }
                                      >
                                        Update
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                {/* ------------------- DELETE DIALOG ------------------- */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <span style={{ color: "red" }}>
                                        Delete
                                      </span>
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeletePost(post.id)
                                        }
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

              {showEditAvt && (
                <EditAvt
                  user={dataUser}
                  currentAvatar={dataUser.userAvatarUrl}
                  onClose={() => setShowEditAvt(false)}
                  onSave={handleAvatarUpdate}
                />
              )}
            </>
          )}
        </>
      ) : (
        <div className="logged-out-container">
          <h2>You are not signed in</h2>
          <p>Please sign in or sign up to view your profile.</p>
        </div>
      )}
    </div>
  );
}
