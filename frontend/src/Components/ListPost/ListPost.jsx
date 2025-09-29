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
                <div key={value["postId"]} className="">
                    <p>User: {value["email"]}</p>
                    <p>Cảm nghĩ: {value["body"]}</p>
                </div>
            ))}
        </div>

        
    )
}