// ListPost.js (Đã cập nhật)
import { useState, useEffect } from "react";
import style from "./ListPost.module.css";
import axios from "axios";
import { toast} from 'sonner';
import CommentPopup from "../Comment/CommentPopup.jsx";

export default function ListPost() {
  const [data, setData] = useState([]);

  // Thêm 2 state mới để quản lý popup
  // 1. popup có mở không?
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  // 2. popup đang mở cho post nào?
  const [selectedPostId, setSelectedPostId] = useState(null);

  const API = async () => {
    try {
      const rs = await axios.get("http://localhost:8080/api/v1/soulspaces");
      // Thêm các trường dữ liệu "ảo" để xử lý state local
      const processedData = rs.data.map((post) => ({
        ...post,
        liked: false, // Thêm trường "liked"
        // Đảm bảo các trường count tồn tại
        likeCount: post.likeCount || 0,
        commentCount: post.commentCount || 0,
        shareCount: post.shareCount || 0,
      }));
      setData(processedData);
    } catch (error) {
      toast.error("Error to connect database");
      console.log("Error to connect database", error);
    }
  };

  useEffect(() => {
    API();
  }, []);

  // console.log(data);
  const handleAction = (postId, type) => {
    if (type === "LIKE") {
      setData((prevData) =>
        prevData.map((post) => {
          if (post.id === postId) {
            // Sửa lại logic: Tăng/giảm dựa trên trạng thái "liked"
            return {
              ...post,
              liked: !post.liked,
              likeCount: post.likeCount + (post.liked ? -1 : 1),
            };
          }
          return post;
        })
      );
      // Lời khuyên: Bạn nên gọi API để "like" ở đây
      // axios.post(`http://localhost:8080/api/v1/posts/${postId}/like`);
    }

    if (type === "COMMENT") {
      // Khi click comment, hãy mở popup
      setSelectedPostId(postId);
      setIsCommentPopupOpen(true);

      // Không cần tăng số đếm ở đây nữa, vì nó sẽ tự tăng khi user submit
      // (Hoặc bạn có thể truyền 1 hàm vào popup để nó gọi ngược lại)
    }

    if (type === "SHARE") {
      setData((prevData) =>
        prevData.map((post) => {
          if (post.id === postId) {
            return { ...post, shareCount: post.shareCount + 1 };
          }
          return post;
        })
      );
      // Lời khuyên: Bạn nên gọi API để "share" ở đây
      // axios.post(`http://localhost:8080/api/v1/posts/${postId}/share`);
    }
  };

  // Hàm để đóng popup
  const handleClosePopup = () => {
    setIsCommentPopupOpen(false);
    setSelectedPostId(null);
  };

  return (
    <>
      <div className={style.layout}>
        {data.map((post) => (
          // Sửa lại key: Dùng post.id thay vì post.userId
          <div key={post.id} className={style.box}>
            <div className={style["post-content"]}>
              <div className={style.header_post}>
                <div className={style.avatar_user}>
                  <img src={post.userAvatarUrl} alt="User Avatar"></img>
                </div>
                <div className={style["user-box"]}>{String(post.userName)}</div>
              </div>
            </div>
            <div className={style["desc-box"]}>{post.content}</div>

            {/* Sửa lại key và biến map */}
            {post.imageContentUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                className={style["picture"]}
                alt="Post content"
              ></img>
            ))}

            <div className={style["status-bar"]}>
              <button
                type="button"
                className={`${style.btn} ${style["btn-like"]} ${
                  post.liked ? style["btn-like-active"] : ""
                }`}
                aria-label="Like"
                onClick={() => handleAction(post.id, "LIKE")}
              >
                <span className={style.icon} />
              </button>
              <span>{post.likeCount}</span>

              {/* COMMENT */}
              <button
                type="button"
                className={`${style.btn} ${style["btn-comment"]}`}
                aria-label="Comment"
                onClick={() => handleAction(post.id, "COMMENT")}
              >
                <span className={style.icon} />
              </button>
              <span>{post.commentCount}</span>

              {/* SHARE */}
              <button
                type="button"
                className={`${style.btn} ${style["btn-share"]}`}
                aria-label="Share"
                onClick={() => handleAction(post.id, "SHARE")}
              >
                <span className={style.icon} />
              </button>
              <span>{post.shareCount}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Render Popup một cách có điều kiện */}
      {isCommentPopupOpen && (
        <CommentPopup postId={selectedPostId} onClose={handleClosePopup} />
      )}
    </>
  );
}
