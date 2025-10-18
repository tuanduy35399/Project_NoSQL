import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // <-- import navigate
import axios from 'axios';
import style from "./PostPage.module.css";

export default function PostPage() {
  const [body, setBody] = useState('');
  const navigate = useNavigate(); // <-- khởi tạo navigate

  // Gửi bài viết
  const postNews = async () => {
    try {
      const formData = {
        body: body
      };

      await axios.post("http://localhost:8080/api/v1/upload", formData);

      setBody('');
      alert('Post successful!');
      navigate('/home'); // <-- chuyển hướng sang trang /home
    } catch (error) {
      console.error('Fail to post:', error);
      alert('Post failure!');
    }
  };

  // Xử lý khi bấm nút "Post"
  const handleSubmit = (e) => {
    e.preventDefault();
    if (body.trim() === '') {
      alert('Nội dung không được để trống!');
      return;
    }
    postNews();
  };

  return (
    <>
      <div>
        <div className={style["infor"]}>
          <center>
            <h2>Make your new post</h2>
          </center>
        </div>

        <div className={style["post-content"]}>
          <textarea
            placeholder="Start a new post..."
            className={style.input}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div>
          <button className={style.buttonPost} onClick={handleSubmit}>
            Post
          </button>
          <button className={style.buttonPost}>Add Image</button>
        </div>
      </div>
    </>
  );
}
