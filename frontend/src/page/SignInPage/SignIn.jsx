import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css';
import axios from 'axios';
import { toast } from "sonner";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();  //ngăn form reload page khi submit

    const formData = { username, password };

    //----------------------------------------connect to backend------------------------------------------------------
    try {
      const response = await axios.post("http://localhost:8080/auth/log-in", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Sign in success:", response.data);

      if (response.data.authentication === true) {
        toast.success("Sign in successfully!");

        localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập thành công
        localStorage.setItem("userId", JSON.stringify(response.data.user.id));
        localStorage.setItem("username", JSON.stringify(response.data.user.username)); // Lưu thông tin user nếu cần

        navigate("/");
      } else {
        toast.error("Incorrect username or password!");
      }

    } catch (error) {
      console.error("Sign in failed:", error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error(data.message || "Invalid input! Please check your username and password.");
        } else if (status === 401) {
          toast.error("Unauthorized! Incorrect username or password.");
        } else if (status === 500) {
          toast.error("Server error! Please try again later.");
        }
      } else {
        toast.error("Cannot connect to server!");
      }
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
