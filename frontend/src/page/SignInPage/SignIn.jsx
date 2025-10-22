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
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        // nếu BE trả lỗi (404, 500, ...)
        alert("Incorrect username or password!");
        return;
      }

      const data = await res.json();

      if (data.result === true) {
        alert("Signed in successfully!");
        navigate("/home");
      } else {
        alert("Incorrect username or password!");
      }

    } catch (error) {
      console.error("Lỗi:", error);
      alert("Cannot connect to server!");
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
