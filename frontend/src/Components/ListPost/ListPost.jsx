import { useState } from "react";
import style from "./ListPost.module.css";
import { API } from "../../data.js";

export default function ListPost() {
  const [data, setData] = useState(API);
  
  const handleAction = (postId, type) => {
    setData((prevData) =>
      prevData.map((post) => {
        if (post.id === postId) {
          if (type === "LIKE") {
            return {
              ...post,
              liked: !post.liked,
              like: post.like + (post.liked ? -1 : 1),
            };
          }
          if (type === "COMMENT") {
            return { ...post, comment: post.comment + 1 };
          }
          if (type === "SHARE") {
            return { ...post, share: post.share + 1 };
          }
        }
        return post;
      })
    );
  };

  // (Optional) Hỗ trợ bàn phím cho accessibility
  const handleKey = (e, fn) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className={style.layout}>
      {data.map((value) => (
        <div key={value.id} className={style.box}>
          <div className={style["user-box"]}>User: {value.email}</div>
          <div className={style["desc-box"]}>Cảm nghĩ: {value.body}</div>

          <div className={style["status-bar"]}>
            {/* LIKE */}
            <button
              type="button"
              className={`${style.btn} ${style["btn-like"]} ${
                value.liked ? style["btn-like-active"] : ""
              }`}
              aria-label="Like"
              onClick={() => handleAction(value.id, "LIKE")}
            >
              <span className={style.icon} />
            </button>
            <span>{value.like}</span>

            {/* COMMENT */}
            <button
              type="button"
              className={`${style.btn} ${style["btn-comment"]}`}
              aria-label="Comment"
              onClick={() => handleAction(value.id, "COMMENT")}
            >
              <span className={style.icon} />
            </button>
            <span>{value.comment}</span>

            {/* SHARE */}
            <button
              type="button"
              className={`${style.btn} ${style["btn-share"]}`}
              aria-label="Share"
              onClick={() => handleAction(value.id, "SHARE")}
            >
              <span className={style.icon} />
            </button>
            <span>{value.share}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
