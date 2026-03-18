'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [streakDays, setStreakDays] = useState(0);
  const router = useRouter();

  const unreadCount = mockNotifications.filter((n) => n.unread && !readIds.has(n.id)).length;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserEmail(user.email ?? '');
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          const name = data?.full_name || user.email?.split('@')[0] || '';
          setUserName(name);
          setUserInitial(name.charAt(0).toUpperCase());
        });

      supabase
        .from('user_progress')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data: rows }) => {
          if (!rows || rows.length === 0) { setStreakDays(0); return; }
          let streak = 1;
          const today = new Date(); today.setHours(0, 0, 0, 0);
          const dates = [...new Set(rows.map(r => new Date(r.created_at).toDateString()))].map(d => new Date(d));
          dates.sort((a, b) => b.getTime() - a.getTime());
          for (let i = 1; i < dates.length; i++) {
            const diff = (dates[i - 1].getTime() - dates[i].getTime()) / 86400000;
            if (diff === 1) streak++; else break;
          }
          const lastDate = dates[0]; lastDate.setHours(0, 0, 0, 0);
          if (today.getTime() - lastDate.getTime() > 86400000) streak = 0;
          setStreakDays(streak);
        });
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

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

      {/* Right actions */}
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

          {notifOpen && (
            <>
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
          <span>{streakDays > 0 ? '🔥' : '⚡'}</span>
          <span className="text-sm font-bold" style={{ color: streakDays > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
            {streakDays > 0 ? streakDays : '0'}
          </span>
        </div>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setAvatarOpen((o) => !o)}
            className="w-8 h-8 rounded-full overflow-hidden"
            style={{ outline: '2px solid var(--border)' }}
          >
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, var(--primary), #5a3fd4)' }}>
              {userInitial || '?'}
            </div>
          </button>

          {avatarOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)} />
              <div
                className="absolute right-0 z-50 mt-2 w-56 rounded-xl shadow-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', top: '100%' }}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{userName}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{userEmail}</p>
                </div>
                {/* Links */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm"
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-raised)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left"
                    style={{ color: '#ff6b6b', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,107,107,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
