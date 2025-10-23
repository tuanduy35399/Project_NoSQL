import React, { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //dùng để chuyển page sau khi đky thành công

  const handleSubmit = async (e) => {  //gọi hàm xử lý khi nhấn đăng ký
    // vì dùng axios nên cần async await
    e.preventDefault();  // tránh reload page khi submit form

    const formData = {fullName, userName, birthday, password}; //tạo object chứa data form

    try {
      const response = await axios.post("http://localhost:8080/api/users", formData, {  // gửi dữ liệu lên server
        //headers: { "Content-Type": "multipart/form-data" },  //Khai báo kdl gửi đi
        //do SignUp không cần upload file nên không cần khai báo kdl formdata này vì chỉ cần file json là được 
        //axios sẽ tự động thêm header phù hợp
      });

      console.log("Signup success:", response.data);  // xử lý phản hồi khi thành công
      alert("Signup successfully! Please sign in.");
      navigate("/signin");  //chuyển đến trang đăng nhập sau khi đky thành công
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed! Please try again.");
    }
  };

  //chỉ để kiểm tra form trước khi gửi (debug)
  console.log({
    fullName,
    userName,
    birthday,
    password,
  });

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label>Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="signup-btn">Sign Up</button>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
