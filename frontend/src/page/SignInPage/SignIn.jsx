import React, { useState } from 'react';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log('Đang đăng nhập với:', { username, password });
    // TODO: Thêm logic xử lý đăng nhập tại đây
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
          Don’t have an account? <a href="#" className="signup-link">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
