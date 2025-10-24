import React, { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUp() {
  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const navigate = useNavigate(); // dùng để chuyển page sau khi đky thành công

  const handleSubmit = async (e) => {
    e.preventDefault(); // tránh reload page khi submit form

    const formData = { fullname, username, password, birthday };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/sign-up",
        formData
      );

      console.log("Signup success:", response.data);
      toast.success("Signup successfully! Please sign in.");
      navigate("/signin");

    } catch (error) {
      console.error("Signup failed:", error);

      if (error.response) {
        // ✅ Có phản hồi từ server (status khác 2xx)
        const { status, data } = error.response;
        console.log("Error status:", status);
        console.log("Error data:", data);

        if (status === 400) {
          toast.error(data.message || "Invalid input or username already exists!");
        } else if (status === 409) {
          toast.error("Username already exists! Please choose another username.");
        } else if (status === 500) {
          toast.error("Server error! Please try again later.");
        } else {
          toast.error(data.message || "Unexpected error occurred!");
        }

      } else if (error.request) {
        // 🚫 Request được gửi đi nhưng không nhận được phản hồi
        console.error("No response from server:", error.request);
        toast.error("Cannot connect to the server. Please check your backend.");
      } else {
        // 💥 Lỗi khác (vd: bug trong code React)
        console.error("Error setting up the request:", error.message);
        toast.error("Something went wrong in the app. Check the console for details.");
      }
    }
  };

  //chỉ để kiểm tra form trước khi gửi (debug)
  console.log({
    fullname,
    username,
    password,
    birthday,
  });

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
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

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
