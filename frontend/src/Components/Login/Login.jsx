import './Login.css'
function Login() {
    return (
        <div className="container">
            <h2 className="title">Sign in or Sign up</h2>
            <p>Express yourself, connect with others.</p>
            <button className="btn">Sign in</button>
            <button className="btn">Sign up</button><br/>
            {/* <form>
                    <input type="text" placeholder="Tên đăng nhập" />
                    <input type="password" placeholder="Mật khẩu" />
                    <button type="submit">Đăng nhập</button>
                </form> */}
            <a href="#" className="link">Continue as guest</a>
        </div>
    );
}
export default Login;