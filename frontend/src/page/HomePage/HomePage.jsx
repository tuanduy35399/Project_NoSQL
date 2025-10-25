import ListPost from "../../Components/ListPost/ListPost"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate(); //cho phép chuyển page thay vì link
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedInStatus);
    }, []);

    return (
        <>
            <ListPost />
        </>
    );
}
