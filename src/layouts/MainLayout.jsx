import React from 'react';
import SidebarFases from '../components/ui/SidebarFases';

const MainLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', fontFamily: 'var(--font-family-base)' }}>
      {/* Assuming SidebarFases is fixed or absolute, it can live here */}
      <SidebarFases />
      <div style={{ marginLeft: '80px', padding: 'var(--spacing-2xl)', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
