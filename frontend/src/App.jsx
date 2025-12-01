// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
// import Job from "./pages/Job";

// import Overview from "./pages/Overview";
// import Profile from "./pages/Profile";


// export default function App() {
//   return (
//     <div>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/job" element={<Job/>} />
//         <Route path="/overview" element={<Overview/>} />
//         <Route path="/profile" element={<Profile/>} />
        
        
//       </Routes>
//     </div>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
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

// Full Pages
import AnalyzeResumePage from "./pages/AnalyzeResumePage";
import JobDetailPage from "./pages/JobDetailPage";

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

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

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

        {/* SUBPAGES TRIGGERED FROM CARDS */}
        <Route
          path="/resume/analysis"
          element={
            <ProtectedRoute>
              <AnalyzeResumePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job/:id"
          element={
            <ProtectedRoute>
              <JobDetailPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
}
