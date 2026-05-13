import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './internship.css';

export default function InternshipLayout() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const navSections = [
    {
      label: 'Main Portal',
      items: [
        { name: 'Dashboard', path: '/internship', icon: 'fa-solid fa-gauge-high' },
        { name: 'My Internship', path: '/internship/enroll', icon: 'fa-solid fa-graduation-cap' },
        { name: 'My Tasks', path: '/internship/tasks', icon: 'fa-solid fa-list-check' },
        { name: 'Daily Learning', path: '/internship/learning', icon: 'fa-solid fa-book-open-reader' }
      ]
    },
    {
      label: 'Personal Growth',
      items: [
        { name: 'My Projects', path: '/internship/projects', icon: 'fa-solid fa-cubes' },
        { name: 'Progress Summary', path: '/internship/summary', icon: 'fa-solid fa-clock-rotate-left' },
        { name: 'Resources', path: '/internship/resources', icon: 'fa-solid fa-cloud-arrow-down' }
      ]
    },
    {
      label: 'Career Prep',
      items: [
        { name: 'Standard Jobs', path: '/internship/jobs', icon: 'fa-solid fa-briefcase' },
        { name: 'Career Roadmap', path: '/internship/roadmap', icon: 'fa-solid fa-map-location-dot' },
        { name: 'Interview Prep', path: '/internship/interview', icon: 'fa-solid fa-comments' }
      ]
    }
  ];

  return (
    <div className="cw-app-shell" style={{ display: 'block', minHeight: 'auto', background: 'transparent' }}>
      {/* MAIN VIEW AREA */}
      <div className="cw-main-area" style={{ height: 'auto', overflow: 'visible' }}>
        {/* WORKSPACE SCREEN CONTENT */}
        <main className="cw-content-area" style={{ padding: '30px 32px 40px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
