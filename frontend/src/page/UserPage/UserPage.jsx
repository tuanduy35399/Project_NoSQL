import './UserPage.css'
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Edit from "../../Components/EditProfile/Edit";
import axios from 'axios';
import { toast } from 'sonner';

export default function UserPage() {
    const [activeTab, setActiveTab] = useState("thread");
    const [showEdit, setShowEdit] = useState(false);
    const [dataUser, setDataUser] = useState([]);

    const fetchDataUser = async () => {
        try {
            const tempData = await axios.get(
              "http://localhost:8080/api/users/68f5a47e35e628702759a434" //lay 1 id cu the
            ); 
            setDataUser(tempData.data);
            console.log("Lay du lieu user thanh cong");
        } catch (error) {
            console.log("Loi khi lay du lieu user", error);
            toast.error("Cannot get data user");
        }

    }  
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
    return (
      <div className="user-page">
        <nav className="nav-bar">
          <h1>
            <span>Profile</span>
          </h1>
          <button className="btn">
            <BsThreeDots />
          </button>
        </nav>
        <nav className="profile">
          <div className="profile-in4">
            <h1>{dataUser.fullname}</h1>
            <p className="name">@{dataUser.username}</p>
            <p>{dataUser.followers} followers</p>
          </div>
          <div className="profile-avt">
            <img src={dataUser.userAvatarUrl} alt="avt" className="avt" />
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
          <Edit user={user} onClose={handleClose} onSave={handleSave} />
        )}
      </div>
    );
}
