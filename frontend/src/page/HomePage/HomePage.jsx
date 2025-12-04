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
        // <motion.div
        //     initial={{ opacity: 0, y: 20 }}     // trạng thái lúc mới xuất hiện
        //     animate={{ opacity: 1, y: 0 }}      // khi đã hiện ra
        //     exit={{ opacity: 0, y: -20 }}       // khi rời khỏi
        //     transition={{ duration: 0.4, ease: "easeInOut" }}
        //     className="page"
        // >
            <>
                <ListPost />
            </>
        // </motion.div> */}
    );
}
