import './Login.css'
function Login({guest}) {

    return (
        <div className="container">
            <h2>Sign in or Sign up</h2>
            <p>Share what’s on your mind, connect with friends.</p>
            <button className="buttonlogin">Sign in</button>
            <button className="buttonlogin">Sign up</button><br/>
            <a onClick={()=>guest(true)} href='#' >Continue as guest</a>
        </div>
    );
}
export default Login;