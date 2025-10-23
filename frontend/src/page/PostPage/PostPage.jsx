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
  const [body, setBody] = useState("");
  const [option, setOption] = useState("private");
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
      formData.append("published", option);
      files.forEach((file) => formData.append("files", file));

      await axios.post("http://localhost:8080/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBody("");
      setFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Post successful!");
      navigate("/home");
    } catch (error) {
      console.error("Fail to post:", error);
      toast.error("Post failure!");
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
        <h2>Make your new post</h2>
      </div>
      <div className={style["post-content"]}>
        <div className={style.header_post}>
          <div className={style.avatar_user}>{/* <img src={url}></img> */}</div>
          <strong>
            <span>Username</span>
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
        {/* <select
          className={style.selectForm}
          value={option}
          onChange={(e) => setOption(e.target.value)}
        >
          <option value="publish">Publish</option>
          <option value="private">Private</option>
        </select> */}
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="publish"
              onChange={(e) => setOption(e.target.value)}
            >
              Publish
            </SelectItem>
            <SelectItem
              value="private"
              onChange={(e) => setOption(e.target.value)}
            >
              Private
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

        {/* Nút đăng bài */}
        <button
          className={style["buttonPost-1"]}
          onClick={handleSubmit}
        ></button>
      </div>
    </div>
  );
}
