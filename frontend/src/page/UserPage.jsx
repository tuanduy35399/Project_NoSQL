import './UserPage.css'
import { useState } from "react";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const user = {
        avatar: "./avt.jpg",
        fullname: "Quynhhh",
        username: "thoconomcarot",
        followers: 0
    };
    return (
        <div className="user-page">
            <nav className="nav-bar">
                {/*Header gồm tiêu đề + nút menu*/}
                <h1><span>Personal Page</span></h1>
                <button className="btn">
                    ...{/*ba chấm ngang*/}
                </button>
            </nav>
            <div className="profile">
                <div className="profile-in4">
                    <h1>{user.fullname}</h1>
                    <p>@{user.username}</p>
                    <p>{user.followers} người theo dõi</p>
                </div>
                <div className="profile-avt">
                    <img src={user.avatar} alt="avt" className="avt" />
                </div>
            </div>

            <button className="edit-btn">Edit profile</button>

            <div className="tab">
                <button className={`tab-btn ${activeTab === "thread" ? "active" : ""}`}
                    onClick={() => setActiveTab("thread")}>
                    Thread
                </button>
                <button className={`tab-btn ${activeTab === "reply" ? "active" : ""}`}
                    onClick={() => setActiveTab("reply")}>
                    Replies
                </button>
                <button className={`tab-btn ${activeTab === "media" ? "active" : ""}`}
                    onClick={() => setActiveTab("media")}>
                    Media
                </button>
                <button
                    className={`tab-btn ${activeTab === "repost" ? "active" : ""}`}
                    onClick={() => setActiveTab("repost")}>
                    Reposts
                </button>
            </div>
            
        </div>
    )
}
