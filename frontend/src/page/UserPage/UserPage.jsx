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
    const [dataUser, setDataUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const fetchDataUser = async () => {
        try {
            const tempData = await axios.get(
                "http://localhost:8080/api/users/68f5a47e35e628702759a434"
            );
            setDataUser(tempData.data);

            console.log("Lấy dữ liệu user thành công");
        } catch (error) {
            console.log("Lỗi khi lấy dữ liệu user", error);
            toast.error("Cannot get data user");
        }
    };

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

    const handleSave = (updatedUser) => {
        setDataUser(updatedUser);
        setShowEdit(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        toast.success("Logged out successfully!");
        navigate("/home");
    };

    if (!dataUser) return <p>Loading...</p>;

    return (
        <div className="user-page">
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

            <nav className="profile">
                <div className="profile-in4">
                    <h1>{dataUser.fullname}</h1>
                    <p className="name">@{dataUser.username}</p>
                    {dataUser.bio && <p className='bio'>{dataUser.bio}</p>}
                    {dataUser.link && <a href={dataUser.link}>{dataUser.link}</a>}
                </div>

                <div className="profile-avt">
                    <img src={dataUser.avatar} alt="avt" className="avt" />
                    <button className="edit-btn" onMouseDown={handleEditClick}>
                        Edit profile
                    </button>
                </div>
            </nav>

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

            {showEdit && (
                <Edit
                    user={dataUser}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
