import ListPost from "../../Components/ListPost/ListPost"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
    const navigate = useNavigate(); //cho phép chuyển page thay vì link

    useEffect(() => {  //chạy code sau khi component render
        const isLoggedIn = localStorage.getItem("isLoggedIn");  //ktra user có đang đăng nhập?
        if (!isLoggedIn || isLoggedIn !== "true") {  //chưa đăng nhập
            navigate("/signin", { replace: true });  //chuyển về trang signin
        } 
    }, [navigate]);

    return (
        <>
            <ListPost />
        </>
    );
}
