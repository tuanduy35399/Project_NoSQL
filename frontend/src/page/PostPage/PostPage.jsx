import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./PostPage.module.css";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 block text-gray-700 group-hover:text-blue-600 transition-colors"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
export default function PostPage() {
  const [body, setBody] = useState("");
  const [publish, setPublish] = useState(true);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoggedIn, setIsLogin] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmit, setIsSubmit] = useState(false);
  console.log(files)
  // ✅ Khi chọn file — hiển thị preview
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    e.target.value = ""; // reset input file để chọn lại được cùng file nếu cần
  };

  // ✅ Xóa một hình
  const handleRemoveImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previewUrls];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviewUrls(newPreviews);

    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const checkLogin = async () => {
    const login = localStorage.getItem("isLoggedIn");
    const userData= await axios.get(`http://localhost:8080/api/users/${localStorage.getItem("userId")?.replaceAll('"', "")}`)
    setData(userData.data);
    setIsLogin(login);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  // Gửi bài viết lên BE
  const postNews = async (storedUserId, storedUsername) => {
    const loadingToast = toast.loading("Uploading...");

    try {
      const formData = new FormData();
      formData.append("userId", storedUserId);
      formData.append("username", storedUsername);
      formData.append("content", body);
      formData.append("published", publish ? "true" : "false");
      files.forEach((file) => formData.append("files", file));

      await axios.post("http://localhost:8080/api/v1/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      toast.success("Post successful!", { id: loadingToast });
      setProgress(0);
      navigate("/");
    } catch (error) {
      toast.error("Post failure!", { id: loadingToast });
      console.error("Error posting:", error);
      setProgress(0);
    }
  };

  // Khi nhấn "Post"
  const handleSubmit = (e) => {
    e.preventDefault();

     if (isSubmit) return;

    setIsSubmit(true); // chặn click nút lần 2

    const storedUserId = localStorage.getItem("userId")?.replaceAll('"', "");
    const storedUsername = localStorage
      .getItem("username")
      ?.replaceAll('"', "");

    if (!storedUserId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (body.trim() === "" && files.length===0) {
      console.log("Khong co hinh va content");
      toast.warning("Content cannot be blank!");
      return;
    }

    postNews(storedUserId, storedUsername);
  };

  return (
    <div className={style.boxlayout}>
      {/* --- Tiêu đề --- */}
      <div className={style.infor}>
        <span style={{ fontSize: 17, fontWeight: 560, marginBottom: 15 }}>
          Make your new post
        </span>
      </div>

      {/* --- Nội dung post --- */}
      {isLoggedIn ? (
        <>
          <div className={style["post-content"]}>
            <div className={style.header_post}>
              <div className={style.avatar_mini_wrapper}>
                <img src={data.userAvatarUrl} alt="AvatarUser" className={style.avatar } />
              </div>
              <strong>
                <span>
                  {"@" +
                    localStorage.getItem("username")?.replaceAll('"', "") ||
                    "unknown"}
                </span>
              </strong>
            </div>

            <textarea
              placeholder="Start a new post..."
              className={style.input}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className={style.previewContainer}>
            {previewUrls.map((url, index) => (
              <div key={index} className={style.previewWrapper}>
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className={style.previewImage}
                />
                <button
                  type="button"
                  className={style.removeButton}
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* --- Tuỳ chọn & nút Post --- */}
          <div className={style.option}>
            <div className={style.leftbuttons}>
              <Select
                onValueChange={(value) => {
                  setPublish(value === "true");
                }}
                defaultValue={String(publish)}
              >
                <SelectTrigger className="w-[180px] border-accent-foreground cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    <span style={{ fontWeight: "bold" }}>Publish</span>
                  </SelectItem>
                  <SelectItem value="false">
                    <span style={{ fontWeight: "bold" }}>Private</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <label
                htmlFor="fileInput"
                className="group cursor-pointer  rounded-lg border flex items-center justify-center bg-white shadow-sm transition-all h-10 w-10"
              >
                <UploadIcon />
              </label>

              <input
                id="fileInput"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className={style.fileInput}
              />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmit} className="w-30 h-10 cursor-pointer">
              Post
            </Button>
          </div>

          {progress > 0 && progress < 100 && (
            <div className={style.progressBar}>
              <div
                className={style.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="logged-out-container">
          <h2>You are not signed in</h2>
          <p>Please sign in or sign up to view your profile.</p>
          {/* <div className="auth-buttons">
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
          </div> */}
        </div>
      )}
    </div>
  );
}
