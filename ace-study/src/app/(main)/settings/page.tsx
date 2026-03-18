'use client';

import { useState } from 'react';
import userProgress from '@/data/user-progress.json';

type Tab = 'profile' | 'preferences' | 'appearance' | 'goals';

const ACCENT_COLORS = [
  { name: 'Purple', value: '#7c5cff' },
  { name: 'Teal', value: '#00d4aa' },
  { name: 'Pink', value: '#ff6b9d' },
  { name: 'Amber', value: '#ffb547' },
  { name: 'Blue', value: '#00BBF9' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [name, setName] = useState(userProgress.user.name);
  const [email, setEmail] = useState(userProgress.user.email);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [accentColor, setAccentColor] = useState('#7c5cff');
  const [fontSize, setFontSize] = useState('medium');
  const [dailyGoal, setDailyGoal] = useState(20);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'goals', label: 'Study Goals' },
  ];

  return (
    <div className="page-enter space-y-8" style={{ maxWidth: '640px' }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your account, preferences, and study goals</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--surface-raised)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 0 12px var(--primary-glow)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg, var(--primary), #5a3fd4)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{email}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Member since {new Date(userProgress.user.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Exam Date</label>
              <input
                type="date"
                defaultValue={userProgress.user.examDate}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preferences tab */}
      {activeTab === 'preferences' && (
        <div className="card p-6 space-y-5">
          <ToggleRow
            label="Timed Practice Mode"
            description="Show a timer during practice questions"
            value={timerEnabled}
            onChange={setTimerEnabled}
          />
          <hr style={{ borderColor: 'var(--border)' }} />
          <ToggleRow
            label="Study Reminders"
            description="Daily notifications to keep your streak"
            value={notifications}
            onChange={setNotifications}
          />
          <hr style={{ borderColor: 'var(--border)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Quick reference for study mode shortcuts</p>
            <div className="space-y-2">
              {[
                { key: 'Space', action: 'Flip flashcard' },
                { key: '←', action: 'Still learning' },
                { key: '→', action: 'Got it' },
                { key: '⌘K', action: 'Open search' },
              ].map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{shortcut.action}</span>
                  <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appearance tab */}
      {activeTab === 'appearance' && (
        <div className="card p-6 space-y-6">
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Accent Color</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Choose your primary interface color</p>
            <div className="flex gap-3">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAccentColor(c.value)}
                  title={c.name}
                  className="w-10 h-10 rounded-full transition-transform"
                  style={{
                    background: c.value,
                    transform: accentColor === c.value ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: accentColor === c.value ? `0 0 12px ${c.value}` : 'none',
                    border: accentColor === c.value ? '2px solid #fff' : '2px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>
          <hr style={{ borderColor: 'var(--border)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Font Size</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Adjust text size for reading comfort</p>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold capitalize"
                  style={{
                    background: fontSize === size ? 'var(--primary-glow)' : 'var(--surface-raised)',
                    color: fontSize === size ? 'var(--primary)' : 'var(--text-secondary)',
                    border: `1px solid ${fontSize === size ? 'var(--primary)50' : 'var(--border)'}`,
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <hr style={{ borderColor: 'var(--border)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Theme</p>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Choose your dark mode variant</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Dark', bg: '#13131a' },
                { name: 'Darker', bg: '#0a0a0f' },
                { name: 'OLED Black', bg: '#000000' },
              ].map((theme) => (
                <button
                  key={theme.name}
                  className="p-3 rounded-xl text-xs font-semibold"
                  style={{
                    background: theme.bg,
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Goals tab */}
      {activeTab === 'goals' && (
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Daily Question Target
            </label>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>How many questions do you want to answer each day?</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xl font-bold w-12 text-center" style={{ color: 'var(--primary)' }}>{dailyGoal}</span>
            </div>
          </div>
          <hr style={{ borderColor: 'var(--border)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Current Progress</p>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Current streak</span>
                <span style={{ color: 'var(--warning)', fontWeight: 700 }}>🔥 {userProgress.stats.streakDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Questions this week</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>47 / {dailyGoal * 7}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Notes completed</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{userProgress.stats.completedNotes}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        className="btn-primary w-full py-3"
        style={saved ? { background: 'var(--secondary)', boxShadow: '0 8px 24px rgba(0,212,170,0.3)' } : {}}
      >
        {saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors"
        style={{ background: value ? 'var(--primary)' : 'var(--border)' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
          style={{ left: '2px', transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}
