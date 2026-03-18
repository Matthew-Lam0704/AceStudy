'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const mockNotifications = [
  { id: 1, text: 'New mock exam available: A-Level Biology', time: '2m ago', unread: true },
  { id: 2, text: 'You scored 85% on Genetics Quiz!', time: '1h ago', unread: true },
  { id: 3, text: 'Flashcard deck "Cell Biology" updated', time: '3h ago', unread: false },
];

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const unreadCount = mockNotifications.filter((n) => n.unread && !readIds.has(n.id)).length;

  const handleNotifOpen = () => {
    setNotifOpen((o) => !o);
  };

  const markAllRead = () => {
    setReadIds(new Set(mockNotifications.map((n) => n.id)));
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 h-16 border-b"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Mobile sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-md"
        style={{ color: 'var(--text-secondary)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-lg">
        {searchOpen ? (
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
              placeholder="Search subjects, topics, questions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-active)',
                color: 'var(--text-primary)',
              }}
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search...</span>
            <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>⌘K</kbd>
          </button>
        )}
      </div>

      {/* Right actions — pushed to far right */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleNotifOpen}
            className="relative p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)', background: notifOpen ? 'var(--surface-raised)' : 'transparent' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            )}
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div
                className="absolute right-0 z-50 mt-2 w-80 rounded-xl shadow-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', top: '100%' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs" style={{ color: 'var(--primary)' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {mockNotifications.map((n) => {
                    const isUnread = n.unread && !readIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                        style={{ background: isUnread ? 'var(--primary-glow)' : 'transparent' }}
                        onClick={() => setReadIds((prev) => new Set([...prev, n.id]))}
                      >
                        {isUnread && (
                          <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--primary)' }} />
                        )}
                        {!isUnread && <span className="mt-1.5 w-2 h-2 flex-shrink-0" />}
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {unreadCount === 0 && (
                  <p className="text-center text-xs py-3" style={{ color: 'var(--text-muted)' }}>All caught up!</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Streak badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <span>🔥</span>
          <span className="text-sm font-bold" style={{ color: 'var(--warning)' }}>14</span>
        </div>

        {/* Avatar */}
        <Link href="/settings" className="w-8 h-8 rounded-full overflow-hidden" style={{ outline: '2px solid var(--border)' }}>
          <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, var(--primary), #5a3fd4)' }}>
            M
          </div>
        </Link>
      </div>
    </header>
  );
}
