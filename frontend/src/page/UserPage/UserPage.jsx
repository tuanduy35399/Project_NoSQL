import './UserPage.css'
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Edit from "../../Components/EditProfile/Edit";

export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const [showEdit, setShowEdit] = useState(false);

    // Dữ liệu user có thể thay đổi
    const [user, setUser] = useState({
        avatar: "/avt.jpg",
        fullname: "Quynhhh",
        username: "thoconomcarot",
        bio: "Write biography",
        link: "",
        followers: 0,
    });

    const handleEditClick = () => {
        setShowEdit(true);
    };

    const handleClose = () => {
        setShowEdit(false);
    };

    // Khi nhấn Done trong Edit
    const handleSave = (updatedUser) => {
        setUser(updatedUser);
        setShowEdit(false);
    };

    return (
        <div className="user-page">
            {/* Header */}
            <nav className="nav-bar">
                <h1><span>Profile</span></h1>
                <button className="btn">
                    <BsThreeDots />
                </button>
            </nav>

            {/* Profile info */}
            <nav className="profile">
                <div className="profile-in4">
                    <h1>{user.fullname}</h1>
                    <p className="name">@{user.username}</p>
                    <p>{user.followers} followers</p>
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
