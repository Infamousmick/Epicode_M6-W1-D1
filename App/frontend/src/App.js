import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import NewBlogPost from "./views/new/New";
import Login from "./views/login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OAuthSuccess from "./views/oauthSuccess/OAuthSuccess";
import BlogPost from "./components/blog/blog-post/BlogPost";
import Profile from "./views/profile/Profile";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/auth/success" element={<OAuthSuccess />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
