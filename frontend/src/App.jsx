import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import Admintaskpage from "./pages/internship/Admintaskpage";

// Internship Portal System
import InternshipLayout from "./pages/internship/InternshipLayout";
import InternshipDashboard from "./pages/internship/Dashboard";
import InternshipEnroll from "./pages/internship/Enroll";
import InternshipTasks from "./pages/internship/Tasks";
import InternshipLearning from "./pages/internship/Learning";
import InternshipSummary from "./pages/internship/Summary";
import InternshipProjects from "./pages/internship/Projects";
import InternshipResources from "./pages/internship/Resources";
import InternshipCertificates from "./pages/internship/Certificates";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/', '/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || 
                           location.pathname.startsWith('/overview') || 
                           location.pathname.startsWith('/internship') || 
                           location.pathname.startsWith('/admin');

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}

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

        {/* SHARED MASTER LAYOUT SHELL */}
        <Route
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        >
          {/* OVERVIEW SECTION */}
          <Route path="/overview">
            <Route index element={<OverviewOutlet />} />
            <Route path="resume-analysis" element={<ResumeAnalysisOutlet />} />
            <Route path="job-match" element={<JobMatchOutlet />} />
            <Route path="career-roadmap" element={<CareerRoadmapOutlet />} />
            <Route path="skills-gap" element={<SkillGapOutlet />} />
            <Route path="interview-prep" element={<InterviewPrepOutlet />} />
          </Route>

          {/* INTERNSHIP PORTAL SYSTEM (ACCESSIBLE VIA /internship) */}
          <Route path="/internship" element={<InternshipLayout />}>
            <Route index element={<InternshipDashboard />} />
            <Route path="enroll" element={<InternshipEnroll />} />
            <Route path="tasks" element={<InternshipTasks />} />
            <Route path="learning" element={<InternshipLearning />} />
            <Route path="summary" element={<InternshipSummary />} />
            <Route path="projects" element={<InternshipProjects />} />
            <Route path="resources" element={<InternshipResources />} />
            <Route path="certificates" element={<InternshipCertificates />} />
          </Route>

          {/* ADMIN PANEL */}
          <Route path="/admin" element={<Admintaskpage />} />
        </Route>

        {/* GRACEFUL REDIRECTS FOR ANY PREVIOUS OVERVIEW-INTERNSHIP PATHS */}
        <Route path="/overview/internship" element={<Navigate to="/internship" replace />} />
        <Route path="/overview/internship/enroll" element={<Navigate to="/internship/enroll" replace />} />
        <Route path="/overview/internship/tasks" element={<Navigate to="/internship/tasks" replace />} />
        <Route path="/overview/internship/learning" element={<Navigate to="/internship/learning" replace />} />
        <Route path="/overview/internship/summary" element={<Navigate to="/internship/summary" replace />} />
        <Route path="/overview/internship/projects" element={<Navigate to="/internship/projects" replace />} />
        <Route path="/overview/internship/resources" element={<Navigate to="/internship/resources" replace />} />
      </Routes>
    </div>
  );
}
