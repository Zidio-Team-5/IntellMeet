import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RouteLoader from "./RouteLoader.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const Login        = lazy(() => import("../pages/Login.jsx"));
const Register     = lazy(() => import("../pages/Register.jsx"));
const Dashboard    = lazy(() => import("../pages/Dashboard.jsx"));
const Meetings     = lazy(() => import("../pages/Meetings.jsx"));
const MeetingRoom  = lazy(() => import("../pages/MeetingRoom.jsx"));
const MeetingHistory = lazy(() => import("../pages/MeetingHistory.jsx"));
const Tasks        = lazy(() => import("../pages/Tasks.jsx"));
const Analytics    = lazy(() => import("../pages/Analytics.jsx"));
const AIWorkspace  = lazy(() => import("../pages/AIWorkspace.jsx"));
const SearchWorkspace = lazy(() => import("../pages/SearchWorkspace.jsx"));
const Team         = lazy(() => import("../pages/Team.jsx"));
const Profile      = lazy(() => import("../pages/Profile.jsx"));
const Settings     = lazy(() => import("../pages/Settings.jsx"));
const NotFound     = lazy(() => import("../pages/NotFound.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/meetings"    element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
        <Route path="/meeting/:id" element={<ProtectedRoute><MeetingRoom /></ProtectedRoute>} />
        <Route path="/history"     element={<ProtectedRoute><MeetingHistory /></ProtectedRoute>} />
        <Route path="/tasks"       element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/analytics"   element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/ai"          element={<ProtectedRoute><AIWorkspace /></ProtectedRoute>} />
        <Route path="/search"      element={<ProtectedRoute><SearchWorkspace /></ProtectedRoute>} />
        <Route path="/team"        element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
