import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/HomePage";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotReset from "./pages/Auth/ForgetReset";
import Verify from "./pages/Auth/Verify";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="auth/forgot" element={<ForgotReset />} />
          <Route path="auth/verify" element={<Verify />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
