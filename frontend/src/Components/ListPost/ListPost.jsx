import {useState, useEffect} from "react"
import style from "./ListPost.module.css"
import {API} from "../../data.js"
export default function ListPost(){
    const [data, setData]= useState([])
    useEffect(()=>{
        API.then((result)=>setData(result))
    }, [])
    return (
        <div className={style["layout"]}>
            {data.map((value)=>(
                <div key={value["postId"]} className={style["box"]}>
                    <div className={style["user-box"]}>User: {value["email"]}</div>
                    <div className={style["desc-box"]}>Cảm nghĩ: {value["body"]}</div>
                    <div className={style["status-bar"]}>
                        <button className={style["like"]}>Like</button>
                        <button className={style["like"]}>Share</button>
                        <button className={style["like"]}>Follow</button>
                    </div>
                </div>
            ))}
        </div>
    )
}