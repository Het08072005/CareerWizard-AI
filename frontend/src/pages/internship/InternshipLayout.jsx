import React from 'react';
import { Outlet } from 'react-router-dom';
import { InternshipProvider } from '../../context/InternshipContext';
import '../../css/internship.css';

export default function InternshipLayout() {
  return (
    <InternshipProvider>
      <div className="cw-app-shell" style={{ display: 'block', minHeight: 'auto', background: 'transparent' }}>
        <div className="cw-main-area" style={{ height: 'auto', overflow: 'visible' }}>
          <main className="cw-content-area" style={{ padding: '30px 32px 40px 32px' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </InternshipProvider>
  );
}
