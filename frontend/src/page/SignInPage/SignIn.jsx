import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css';
import axios from 'axios';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // dùng để chuyển trang sau khi login

  const handleSignIn = async (e) => {
    e.preventDefault();

    const formData = { username, password };
    try {
      const response = await axios.post("http://localhost:8080/api/users/sign-in", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signin success:", response.data); // log phản hồi từ server để kiểm tra
      alert("Signin successfully!");
      navigate("/home"); // chuyển đến trang home sau khi đăng nhập thành công
    } catch (error) {
      console.error("Signin failed:", error);
      console.log("Error response data:", error.response?.data); // log chi tiết lỗi từ server nếu có
      alert("Signin failed! Please try again.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Sign In</h2>
        <form onSubmit={handleSignIn} className="signin-form">
          <input
            type="text"
            placeholder="Username, phone or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signin-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <a href="#" className="forgot-password">
          Forgot password?
        </a>
        <p className="signup-text">
          Don’t have an account?{' '}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
