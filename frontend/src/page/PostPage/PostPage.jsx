import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./PostPage.module.css";

export default function PostPage() {
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
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
    try {
      const formData = new FormData();
      formData.append("userId", "1"); //fake user id
      formData.append("content", body);
      formData.append("published", published);
      files.forEach((file) => formData.append("files", file));

      await axios.post("http://localhost:8080/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBody("");
      setFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      alert("Post successful!");
      navigate("/home");
    } catch (error) {
      console.error("Fail to post:", error);
      alert("Post failure!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (body.trim() === "") {
      alert("Content cannot be blank!");
      return;
    }
    postNews();
  };

  return (
    <div>
      <div className={style.infor}>
        <center><h2>Make your new post</h2></center>
      </div>

      <div className={style["post-content"]}>
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
            <img src={url} alt={`preview-${index}`} className={style.previewImage} />
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

      <div className={style.option1}>
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            /> Publish
          </label>

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

        {/* Nút đăng bài */}
        <button className={style["buttonPost-1"]} onClick={handleSubmit}></button>
      </div>
    </div>
  );
}
