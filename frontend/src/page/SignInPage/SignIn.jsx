import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // dùng để chuyển trang sau khi login

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.result.authentication) {
        alert("Đăng nhập thất bại");
        return;
      }

      // Lưu thông tin đăng nhập (chỉ username ở đây)
      localStorage.setItem("user", JSON.stringify({ username }));

      alert("Đăng nhập thành công!");
      console.log("User đã đăng nhập:", username);

      // Chuyển sang trang dashboard/home
      navigate("/home");

    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến server");
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
