import { useState, useEffect } from "react";
import style from "./ListPost.module.css";
import axios from "axios";
import { toast } from "sonner";
import CommentPopup from "../Comment/CommentPopup.jsx";

export default function ListPost() {
  const [data, setData] = useState([]);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  //Lấy dữ liệu từ backend
  const fetchPosts = async () => {
    try {
      const rs = await axios.get("http://localhost:8080/api/v1/soulspaces");
      if (!Array.isArray(rs.data)) {
        console.error("API không trả về mảng hợp lệ:", rs.data);
        toast.error("Invalid API response format");
        return;
      }

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAction = async (postId, type) => {
    if (type === "LIKE") {
      // 1. Cập nhật UI ngay lập tức (Optimistic Update)
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

      // 2. Gửi request đến backend
      try {
        // Giả sử bạn có API: POST /api/posts/{postId}/like
        // Bạn cần lấy userId từ localStorage hoặc context
        const userId = String(localStorage.getItem("userId")).replaceAll(
          '"',
          ""
        );

        // API thật sự của bạn có thể khác
        await axios.post(`http://localhost:8080/api/v1/likes/${postId}`, {
          userId,
        });
        // Nếu backend trả về số like mới, bạn có thể cập nhật state một lần nữa
      } catch (error) {
        console.error("Error liking post:", error);
        toast.error("Failed to like post.");

        // 3. Nếu API lỗi, hoàn tác lại thay đổi ở UI
        setData((prevData) =>
          prevData.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked, // Đảo ngược lại
                  likeCount: post.likeCount + (post.liked ? 1 : -1), // Đảo ngược lại
                }
              : post
          )
        );
      }
    }

    if (type === "COMMENT") {
      setSelectedPostId(postId);
      setIsCommentPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsCommentPopupOpen(false);
    setSelectedPostId(null);
  };

  return (
    <>
      <div className={style.layout}>
        {data.length > 0 ? (
          [...data].reverse().map((post) => (
            <div key={post.id} className={style.box}>
              {/* --- Header post --- */}
              <div className={style["post-content"]}>
                <div className={style.header_post}>
                  <div className={style.avatar_mini_wrapper}>
                    <img
                      src={post.userAvatarUrl || "/default-avatar.png"}
                      alt="User Avatar"
                      className={style.avatar}
                    />
                  </div>
                  <div className={style["user-box"]}>
                    {post.userName ? "@" + post.userName : "Unknown user"}
                  </div>
                </div>
              </div>

              <div className={style["desc-box"]}>{post.content}</div>

              {Array.isArray(post.imageContentUrls) &&
                post.imageContentUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className={style["picture"]}
                    alt={`Post image ${index}`}
                  />
                ))}

              <span style={{ color: "grey", fontSize: 13, opacity: "70%" }}>
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
          ))
        ) : (
          <center>
            <span>
              {" "}
              <i>Empty post</i>
            </span>
          </center>
        )}
      </div>

      {/* --- Comment Popup --- */}
      {isCommentPopupOpen && (
        <CommentPopup postId={selectedPostId} onClose={handleClosePopup} />
      )}
    </>
  );
}
