import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Job from "./pages/Job";

// Overview + Nested Tabs
import Overview from "./pages/Overview";
import OverviewOutlet from "./components/OverviewOutlet";
import ResumeAnalysisOutlet from "./components/ResumeAnalysisOutlet";
import JobMatchOutlet from "./components/JobMatchOutlet";
import SkillGapOutlet from "./components/SkillGapOutlet";
import InterviewPrepOutlet from "./components/InterviewPrepOutlet";
import CareerRoadmapOutlet from "./components/CareerRoadmapOutlet";



// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job"
          element={
            <ProtectedRoute>
              <Job />
            </ProtectedRoute>
          }
        />

        {/* OVERVIEW + TABS */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewOutlet />} />
          <Route path="resume-analysis" element={<ResumeAnalysisOutlet />} />
          <Route path="job-match" element={<JobMatchOutlet />} />
          <Route path="career-roadmap" element={<CareerRoadmapOutlet />} />
          <Route path="skills-gap" element={<SkillGapOutlet />} />
          <Route path="interview-prep" element={<InterviewPrepOutlet />} />
        </Route>

       

      </Routes>
    </div>
  );
}
