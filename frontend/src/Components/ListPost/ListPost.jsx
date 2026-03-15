import { useState, useEffect } from "react";
import style from "./ListPost.module.css";
import axios from "axios";
import { toast } from "sonner";
import CommentPopup from "../Comment/CommentPopup.jsx";

export default function ListPost() {
  const [data, setData] = useState([]);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Lấy dữ liệu từ backend
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
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
        sharesCount: post.sharesCount || 0,
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
      setData((prevData) =>
        prevData.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likesCount: post.likesCount + (post.liked ? -1 : 1),
              }
            : post
        )
      );

      try {
        const userId = String(localStorage.getItem("userId")).replaceAll(
          '"',
          ""
        );

        await axios.post(`http://localhost:8080/api/v1/likes/${postId}`, {
          userId,
        });
      } catch (error) {
        console.error("Error liking post:", error);
        toast.error("Failed to like post.");

        setData((prevData) =>
          prevData.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likesCount: post.likesCount + (post.liked ? 1 : -1),
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

    if (type === "SHARE") {
      const shareUrl = `${window.location.origin}/post/${postId}`;

      try {
        if (navigator.share) {
          await navigator.share({
            title: "Soul Space Post",
            text: "Xem bài viết này nè",
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Đã copy link bài viết");
        }

        setData((prevData) =>
          prevData.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  sharesCount: (post.sharesCount || 0) + 1,
                }
              : post
          )
        );
      } catch (error) {
        console.error("Error sharing post:", error);
        toast.error("Không thể chia sẻ bài viết");
      }
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
              {/* Header post */}
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
                    {post.username ? "@" + post.username : "Unknown user"}
                  </div>
                </div>
              </div>

              <div className={style["desc-box"]}>{post.content}</div>

              {Array.isArray(post.imageContentUrls) &&
                post.imageContentUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className={style.picture}
                    alt={`Post image ${index}`}
                  />
                ))}

              <span style={{ color: "grey", fontSize: 13, opacity: "70%" }}>
                {new Date(post.createdAt).toLocaleString("vi-VN", {
                  hour12: false,
                })}
              </span>

              {/* Thanh trạng thái */}
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
                <span>{post.likesCount}</span>

                {/* COMMENT */}
                <button
                  type="button"
                  className={`${style.btn} ${style["btn-comment"]}`}
                  aria-label="Comment"
                  onClick={() => handleAction(post.id, "COMMENT")}
                >
                  <span className={style.icon} />
                </button>
                <span>{post.commentsCount}</span>

                {/* SHARE */}
                <button
                  type="button"
                  className={`${style.btn} ${style["btn-share"]}`}
                  aria-label="Share"
                  onClick={() => handleAction(post.id, "SHARE")}
                >
                  <span className={style.icon} />
                </button>
                <span>{post.sharesCount}</span>
              </div>
            </div>
          ))
        ) : (
          <center>
            <span>
              <i>Empty post</i>
            </span>
          </center>
        )}
      </div>

      {/* Comment Popup */}
      {isCommentPopupOpen && (
        <CommentPopup postId={selectedPostId} onClose={handleClosePopup} />
      )}
    </>
  );
}