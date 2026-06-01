import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import MeetingRoom from "../pages/MeetingRoom";
import MeetingHistory from "../pages/MeetingHistory";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/meeting/:id" element={<MeetingRoom />} />
      <Route path="/history" element={<MeetingHistory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}