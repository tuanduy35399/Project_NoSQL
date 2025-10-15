import { Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage/HomePage.jsx";
import PostPage from "../page/PostPage/PostPage.jsx";
import UserPage from "../page/UserPage/UserPage.jsx";
import SignIn from "../page/SignInPage/SignIn.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post" element={<PostPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}
