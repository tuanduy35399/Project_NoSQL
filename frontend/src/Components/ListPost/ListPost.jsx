import { useEffect, useState } from "react";
import style from "./ListPost.module.css";
import { API } from "../../data.js";

export default function ListPost() {
  const [data, setData] = useState(API);

//   useEffect(() => {
//     API.then((result) => setData(result));
//   }, []);

  const handleAction = (postId, type) => {
    setData((prevData) =>
      prevData.map((post) => {
        if (post.id === postId) {
          if (type === "LIKE") {
            return {
              ...post,
              liked: !post.liked, // toggle like
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

  return (
    <div className={style["layout"]}>
      {data.map((value) => (
        <div key={value.id} className={style["box"]}>
          <div className={style["user-box"]}>User: {value.email}</div>
          <div className={style["desc-box"]}>Cảm nghĩ: {value.body}</div>

          <div className={style["status-bar"]}>
            <button
              className={`${style["btn"]} ${style["btn-like"]} ${
                value.liked ? style["btn-like-active"] : ""
              }`}
              onClick={() => handleAction(value.id, "LIKE")}
            />
            <span>{value.like}</span>

            <button
              className={`${style["btn"]} ${style["btn-comment"]}`}
              onClick={() => handleAction(value.id, "COMMENT")}
            />
            <span>{value.comment}</span>

            <button
              className={`${style["btn"]} ${style["btn-share"]}`}
              onClick={() => handleAction(value.id, "SHARE")}
            />
            <span>{value.share}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
