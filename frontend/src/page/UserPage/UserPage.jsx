import './UserPage.css'
import { useState } from "react";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const user = {
        avatar: "/avt.jpg",
        fullname: "Quynhhh",
        username: "thoconomcarot",
        followers: 0
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
                    <button className="edit-btn">Edit profile</button>
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
            
            <div className='hh'>
            </div>
            
        </div>
    )
}
