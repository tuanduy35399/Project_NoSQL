import { useState, useEffect } from "react";
import style from "./ListPost.module.css";
import axios from "axios";
// import { API } from "../../data.js";

export default function ListPost() {
  const [data, setData] = useState([]);
  const API =  async ()=>{
    try{
      const rs = await axios.get('http://localhost:8080/api/v1/blogs/68f3e9ace3b2d8fdce241a4c');
      setData([rs.data])
    }catch(error){
      alert("Error to connect database");
      console.log("Error to connect database", error);
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
              like: post.likeCount + (post.likeCount ? -1 : 1),
            };
          }
          if (type === "COMMENT") {
            return { ...post, comment: post.commentCount + 1 };
          }
          if (type === "SHARE") {
            return { ...post, share: post.shareCount+ 1 };
          }
        }
        return post;
      })
    );
  };

  return (
    <div className={style.layout}>
      {data.map((value) => (
        <div key={value.userId} className={style.box}>
          <div className={style["post-content"]}>
                  <div className={style.header_post}>
                    <div className={style.avatar_user}>
                      {/* <img src={url}></img> */}
                    </div>
                    <div className={style["user-box"]}>{value.userId}</div>
                  </div>
          </div>
          <div className={style["desc-box"]}>{value.content}</div>
          {
              value.imageUrls.map((value)=>(
                  <img src={value} className={style["picture"]}></img>
              ))  
          }
          <div className={style["status-bar"]}>
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
