import './UserPage.css'
import { useEffect, useState, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import Edit from "../../Components/EditProfile/Edit";
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const [showEdit, setShowEdit] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const fetchDataUser = async () => {
        try {
            const tempData = await axios.get(
                "http://localhost:8080/api/users/68f54ae35e628702759a434" // lấy 1 id cũ thể
            );
            setDatAuser(tempData.data);

            console.log("lay du lieu user thanh cong");
        } catch (error) {
            console.log("Loi khi lay du lieu user", error);
            toast.error("Cannot get data user");
        }
    }

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        fetchDataUser();
    }, []);

    const handleEditClick = () => {
        setShowEdit(true);
    };

    const handleClose = () => {
        setShowEdit(false);
    };

    // Khi nhấn Done trong Edit
    const handleSave = (updatedUser) => {
        setDataUser(updatedUser);
        setShowEdit(false);
    };

    //Hàm logout
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");  // Xóa trạng thái signin
        toast.success("Logged out successfully!");  //thông báo đăng xuất thành công
        navigate("/home");
    };
    return (
        <div className="user-page">


            {/* Header */}
            <nav className="nav-bar">
                <h1><span>Profile</span></h1>
                <div className="menu-wrapper" ref={menuRef}>
                    <button className="btn" onClick={() => setMenuOpen(!menuOpen)}>
                        <BsThreeDots />
                    </button>
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogout}>Log out</button>
                        </div>
                    )}
                </div>
            </nav>


            {/* Profile info */}
            <nav className="profile">
                <div className="profile-in4">
                    <h1>{user.fullname}</h1>
                    <p className="name">@{user.username}</p>
                    {/* <p>{user.followers} followers</p> */}
                    {user.bio && <p className='bio'>{user.bio}</p>}
                    {user.link && <a href={user.link}>{user.link}</a>}
                </div>
                <div className="profile-avt">
                    <img src={user.avatar} alt="avt" className="avt" />
                    <button className="edit-btn" onMouseDown={handleEditClick}>
                        Edit profile
                    </button>
                </div>
            </nav>



            {/* Tabs */}
            <nav className="tab">
                {["thread", "reply", "media", "repost"].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                        onMouseDown={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </nav>


            {/* Hiển thị Edit modal */}
            {showEdit && (
                <Edit
                    user={user}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
