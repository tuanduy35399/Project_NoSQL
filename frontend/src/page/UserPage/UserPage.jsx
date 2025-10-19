import './UserPage.css'
import { useState } from "react";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import Edit from "../../Components/EditProfile/Edit"; 
export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const [showEdit, setShowEdit] = useState(false);
    const user = {
        avatar: "/avt.jpg",
        fullname: "Quynhhh",
        username: "thoconomcarot",
        followers: 0
    };
    const handleEditClick = () => {
        setShowEdit(true);
    };

    const handleClose = () => {
        setShowEdit(false);
    };
    return (
        <div className="user-page">
            <nav className="nav-bar">
                {/*Header gồm tiêu đề + nút menu*/}
                <h1><span>Profile</span></h1>
                <button className="btn">
                    <BsThreeDots />{/*ba chấm ngang*/}
                </button>
            </nav>
            <nav className="profile">
                <div className="profile-in4">
                    <h1>{user.fullname}</h1>
                    <p className="name">@{user.username}</p>
                    <p>{user.followers} followers</p>
                </div>
                <div className="profile-avt">
                    <img src={user.avatar} alt="avt" className="avt" />
                    <button className="edit-btn" onMouseDown={handleEditClick}>
                        Edit profile
                    </button>
                </div>
            </nav>
            <nav className="tab">
                <button className={`tab-btn ${activeTab === "thread" ? "active" : ""}`}
                    onMouseDown={() => setActiveTab("thread")}>
                    Post
                </button>
                <button className={`tab-btn ${activeTab === "reply" ? "active" : ""}`}
                    onMouseDown={() => setActiveTab("reply")}>
                    Replies
                </button>
                <button className={`tab-btn ${activeTab === "media" ? "active" : ""}`}
                    onMouseDown={() => setActiveTab("media")}>
                    Media
                </button>
                <button
                    className={`tab-btn ${activeTab === "repost" ? "active" : ""}`}
                    onMouseDown={() => setActiveTab("repost")}>
                    Reposts
                </button>
            </nav>

            {showEdit && (
                <div className="overlay">
                    <div className="modal">
                        <Edit />
                        <button className="close-btn" onClick={handleClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
