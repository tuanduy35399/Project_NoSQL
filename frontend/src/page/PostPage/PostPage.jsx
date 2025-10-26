import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./PostPage.module.css";
import { toast} from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function PostPage() {
  const [userData, setUserData] = useState("");
  const [body, setBody] = useState("");
  const [publish, setPublish] = useState(true);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Khi chọn file
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    e.target.value = ""; // reset input file
  };

  // Xóa một hình
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

 const postNews = async () => {
   const loadingToast = toast.loading(`Uploading ${progress}%`);
   try {
     const localStore= localStorage.getItem("user")
     setUserData(localStore.data);
     const formData = new FormData();
     formData.append("userId", "6719c9c5e4b0a12a8b1f56b3");
     formData.append("userName", localStore.username);
     formData.append("content", body);
     formData.append("published", publish ? "true" : "false");
     files.forEach((file) => formData.append("files", file));

     await axios.post("http://localhost:8080/api/v1/blogs", formData, {
       headers: { "Content-Type": "multipart/form-data" },
       onUploadProgress: (e) => {
         const percent = Math.round((e.loaded * 100) / e.total);
         setProgress(percent);
         toast.loading(`Uploading ${percent}%`, { id: loadingToast });
       },
     });

     toast.success("Post successful!", { id: loadingToast });
     setProgress(0);
     navigate("/");
   } catch (error) {
     toast.error("Post failure!", { id: loadingToast });
     console.log("Xay ra loi khi post bai viet ", error);
     setProgress(0);
   }
 };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (body.trim() === "") {
      toast.warning("Content cannot be blank!");
      return;
    }
    postNews();
  };

  return (
    <div>
      <div className={style.infor}>
        <span style={{ fontSize: 20, fontWeight: "bold" }}>
          Make your new post
        </span>
      </div>
      <div className={style["post-content"]}>
        <div className={style.header_post}>
          <div className={style.avatar_user}>
            <img src={userData.userAvatarUrl} alt="AvatarUser"></img>
          </div>
          <strong>
            <span>{userData.username || "unknown"}</span>
          </strong>
        </div>
        <textarea
          placeholder="Start a new post..."
          className={style.input}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {/* Hiển thị preview hình */}
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

      <div className={style.option}>
        <Select
          onValueChange={(value) => {
            setPublish(value === "true");
          }}
          defaultValue={String(publish)}
        >
          <SelectTrigger className="w-[180px] border-accent-foreground">
            <SelectValue placeholder="Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">
              <span style={{fontWeight:"bold"}}>Publish</span>
            </SelectItem>
            <SelectItem value="false">
              <span style={{ fontWeight: "bold" }}>Private</span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Nút chọn file bằng hình post.png */}
        <label htmlFor="fileInput" className={style["buttonPost-2"]}></label>
        <input
          id="fileInput"
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className={style.fileInput}
        />
        <button
          className={style["buttonPost-1"]}
          onClick={handleSubmit}
        ></button>
      </div>
    </div>
  );
}
