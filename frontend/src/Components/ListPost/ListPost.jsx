import { useState, useEffect } from "react";
import style from "./ListPost.module.css";
import axios from "axios";
import { toast } from "sonner";
import CommentPopup from "../Comment/CommentPopup.jsx";

export default function ListPost() {
  const [data, setData] = useState([]);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // ✅ Lấy dữ liệu từ backend
  const fetchPosts = async () => {
    try {
      const rs = await axios.get("http://localhost:8080/api/v1/soulspaces");
      if (!Array.isArray(rs.data)) {
        console.error("API không trả về mảng hợp lệ:", rs.data);
        toast.error("Invalid API response format");
        return;
      }

      // ✅ Thêm field local (liked, count fallback)
      const processedData = rs.data.map((post) => ({
        ...post,
        liked: false,
        likeCount: post.likeCount || 0,
        commentCount: post.commentCount || 0,
        shareCount: post.shareCount || 0,
      }));

      setData(processedData);
    } catch (error) {
      toast.error("Error connecting to database");
      console.error("Error fetching posts:", error);
    }
  };

  // ✅ Chạy khi component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Xử lý like/comment
  const handleAction = (postId, type) => {
    if (type === "LIKE") {
      setData((prevData) =>
        prevData.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likeCount: post.likeCount + (post.liked ? -1 : 1),
              }
            : post
        )
      );

      // Gợi ý: Gọi API like ở đây nếu backend có hỗ trợ
      // axios.post(`http://localhost:8080/api/v1/posts/${postId}/like`);
    }

    if (type === "COMMENT") {
      setSelectedPostId(postId);
      setIsCommentPopupOpen(true);
    }
  };

  // ✅ Đóng popup
  const handleClosePopup = () => {
    setIsCommentPopupOpen(false);
    setSelectedPostId(null);
  };

  return (
    <>
      <div className={style.layout}>
        {[...data] // tránh mutate data khi reverse
          .reverse()
          .map((post) => (
            <div key={post.id} className={style.box}>
              {/* --- Header post --- */}
              <div className={style["post-content"]}>
                <div className={style.header_post}>
                  <div className={style.avatar_user}>
                    <img
                      src={post.userAvatarUrl || "/default-avatar.png"}
                      alt="User Avatar"
                    />
                  </div>
                  <div className={style["user-box"]}>
                    {post.userName ?? "Unknown user"}
                  </div>
                </div>
              </div>

              {/* --- Nội dung bài viết --- */}
              <div className={style["desc-box"]}>{post.content}</div>

              {/* --- Hình ảnh bài viết --- */}
              {Array.isArray(post.imageContentUrls) &&
                post.imageContentUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className={style["picture"]}
                    alt={`Post image ${index}`}
                  />
                ))}

              {/* --- Thời gian đăng --- */}
              <span style={{ color: "grey" }}>
                {new Date(post.createdAt).toLocaleString("vi-VN", {
                  hour12: false,
                })}
              </span>

              {/* --- Thanh trạng thái (like / comment) --- */}
              <div className={style["status-bar"]}>
                {/* LIKE */}
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
              </div>
            </div>
          ))}
      </div>

      {/* --- Comment Popup --- */}
      {isCommentPopupOpen && (
        <CommentPopup postId={selectedPostId} onClose={handleClosePopup} />
      )}
    </>
  );
}
