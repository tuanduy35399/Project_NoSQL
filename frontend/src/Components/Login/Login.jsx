import './Login.css'
function Login() {

    return (
        <div className="container">
            <h2>Sign in or Sign up</h2>
            <p>Express yourself, connect with others.</p>
            <button className="btn">Sign in</button>
            <button className="btn">Sign up</button><br/>
            <a href='#' >Continue as guest</a>
        </div>
    );
}
export default Login;