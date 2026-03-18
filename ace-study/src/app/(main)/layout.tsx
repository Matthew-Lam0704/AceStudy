'use client';

import { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Navbar from '@/components/Layout/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div
        className={`fixed lg:relative z-50 lg:z-auto transition-transform duration-250 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onToggleSidebar={() => setMobileSidebarOpen((o) => !o)} />
        <main className="flex-1 page-enter" style={{ padding: '1.5rem 2rem', maxWidth: '1400px', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
