import { useState, useEffect } from "react";
import style from "./ListPost.module.css";
import axios from "axios";
// import { API } from "../../data.js";

export default function ListPost() {
  const [data, setData] = useState([]);
  const API =  async ()=>{
    try{
      const rs = await axios.get('http://localhost:8080/api/v1/blogs/68f3ee73899d3611c9cfc4ef');
      setData([rs.data])
    }catch(error){
      alert('Loi data');
      console.log('loi data');
    }
    }
    
  useEffect(()=>{
    API();
  }, []);
  
  // console.log(data);
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
          <div className={style["user-box"]}>User: {value.userName}</div>
          <div className={style["desc-box"]}>Cảm nghĩ: {value.content}</div>

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
            <span>{value.likeCount}</span>

            {/* COMMENT */}
            <button
              type="button"
              className={`${style.btn} ${style["btn-comment"]}`}
              aria-label="Comment"
              onClick={() => handleAction(value.id, "COMMENT")}
            >
              <span className={style.icon} />
            </button>
            <span>{value.commentCount}</span>

            {/* SHARE */}
            <button
              type="button"
              className={`${style.btn} ${style["btn-share"]}`}
              aria-label="Share"
              onClick={() => handleAction(value.id, "SHARE")}
            >
              <span className={style.icon} />
            </button>
            <span>{value.shareCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
