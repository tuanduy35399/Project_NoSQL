import './Login.css'
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Login({ guest }) {
    const navigate = useNavigate();
    return (
        <div className="container">
            <h2>Sign in or Sign up</h2>
            <p>Share what’s on your mind, connect with friends.</p>
            <button className="buttonLogin" onClick={() => navigate('/signin')}>
                Sign in
            </button>
            <button onMouseDown={() => navigate("/signup")} className="buttonLogin">Sign up</button><br />
            <a onClick={() => guest(true)} href='#' >Continue as guest</a>
        </div>
    );
}
export default Login;