'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import userProgress from '@/data/user-progress.json';
import subjects from '@/data/subjects.json';

export default function Dashboard() {
  const sparkGreenRef = useRef<HTMLCanvasElement>(null);
  const sparkRedRef = useRef<HTMLCanvasElement>(null);
  const progressChartRef = useRef<HTMLCanvasElement>(null);

  const { stats, recentActivity, recommendedTopics, scoreHistory } = userProgress;

  const chartPoints = scoreHistory.map((s) => s.score / 100);

  useEffect(() => {
    function drawSparkline(canvas: HTMLCanvasElement, color: string, trend: number[]) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      const step = w / (trend.length - 1);
      ctx.moveTo(0, h - trend[0] * h);
      for (let i = 1; i < trend.length; i++) {
        ctx.lineTo(i * step, h - trend[i] * h);
      }
      ctx.stroke();
    }

    function drawMainChart() {
      const canvas = progressChartRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(2, 2);
      const w = rect.width;
      const h = rect.height;
      const points = chartPoints;
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(124, 92, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(124, 92, 255, 0)');
      const step = w / (points.length - 1);
      ctx.beginPath();
      ctx.strokeStyle = '#7c5cff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(124, 92, 255, 0.5)';
      ctx.moveTo(0, h - points[0] * h);
      for (let i = 1; i < points.length; i++) {
        const x = i * step;
        const y = h - points[i] * h;
        const prevX = (i - 1) * step;
        const prevY = h - points[i - 1] * h;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    if (sparkGreenRef.current) drawSparkline(sparkGreenRef.current, '#00d4aa', [0.2, 0.4, 0.3, 0.6, 0.5, 0.8]);
    if (sparkRedRef.current) drawSparkline(sparkRedRef.current, '#ff6b9d', [0.8, 0.6, 0.7, 0.4, 0.5, 0.3]);
    drawMainChart();

    window.addEventListener('resize', drawMainChart);
    return () => window.removeEventListener('resize', drawMainChart);
  }, []);

  const activityIcons: Record<string, React.ReactNode> = {
    flashcard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    quiz: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    notes: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    mock: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const activityColors: Record<string, string> = {
    flashcard: '#00BBF9',
    quiz: '#00d4aa',
    notes: '#7c5cff',
    mock: '#ffb547',
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙';

  return (
    <div className="page-enter space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {userProgress.user.name} {greetingEmoji}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            You&apos;re on a <span style={{ color: 'var(--warning)', fontWeight: 700 }}>🔥 {stats.streakDays}-day streak</span> — keep it up!
          </p>
        </div>
        <Link
          href="/mocks"
          className="hidden sm:inline-flex items-center gap-2 btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Continue Mock Exam
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Questions Answered</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.questionsAnswered.toLocaleString()}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--secondary)' }}>+47 this week</p>
          <div className="mt-3 h-8">
            <canvas ref={sparkGreenRef} height="30" width="100" className="w-full h-full" />
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Study Hours / Week</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.studyHoursThisWeek}h</p>
          <p className="text-xs mt-1" style={{ color: 'var(--warning)' }}>↑ 2h vs last week</p>
          <div className="mt-3 h-8">
            <canvas ref={sparkRedRef} height="30" width="100" className="w-full h-full" />
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Average Score</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{stats.averageScore}%</p>
          </div>
          <div className="mt-3 progress-bar">
            <div className="progress-fill" style={{ width: `${stats.averageScore}%` }} />
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Streak Days</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>🔥 {stats.streakDays}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Personal best: 21 days</p>
        </div>
      </div>

      {/* Chart + Recommended */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Score Progress</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Last 8 sessions</p>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{stats.averageScore}%</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <canvas ref={progressChartRef} className="w-full h-full" />
          </div>
        </div>

        {/* Recommended Topics */}
        <div className="card p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recommended Next</h2>
          <div className="space-y-3">
            {recommendedTopics.map((topic) => (
              <Link
                key={topic.topicId}
                href={`/subjects/${topic.subjectId}`}
                className="flex items-start gap-3 p-3 rounded-lg block"
                style={{ background: 'var(--surface-raised)', textDecoration: 'none' }}
              >
                <span className="text-2xl">{topic.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{topic.topicName}</p>
                  <p className="text-xs mt-0.5" style={{ color: topic.score < 50 ? 'var(--accent)' : 'var(--text-muted)' }}>{topic.reason}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity + Quick Access */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <Link
                key={activity.id}
                href={activity.link}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'var(--surface-raised)', textDecoration: 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${activityColors[activity.type]}20`, color: activityColors[activity.type] }}>
                    {activityIcons[activity.type]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{activity.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</p>
                  </div>
                </div>
                {activity.scoreChange > 0 && (
                  <span className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>+{activity.scoreChange}%</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access Subjects */}
        <div className="card p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Your Subjects</h2>
          <div className="grid grid-cols-2 gap-3">
            {subjects.slice(0, 6).map((subject) => (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className="p-3 rounded-lg flex items-center gap-3 transition-all"
                style={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  textDecoration: 'none',
                }}
              >
                <span className="text-xl">{subject.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{subject.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject.topicCount} topics</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
