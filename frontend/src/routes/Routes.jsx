import {Routes, Route} from "react-router-dom"
import HomePage from "../assets/page/HomePage.jsx"
import PostPage from "../assets/page/PostPage.jsx"
import UserPage from "../assets/page/UserPage.jsx"
export default function Router(){
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/post" element={<PostPage/>}/>
            <Route path="/user" element={<UserPage/>}/>
        </Routes>
    )
}