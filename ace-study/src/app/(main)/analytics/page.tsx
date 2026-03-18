'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import userProgress from '@/data/user-progress.json';
import subjects from '@/data/subjects.json';

export default function AnalyticsPage() {
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const { stats, subjectScores, scoreHistory, studyHeatmap, recommendedTopics } = userProgress;

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  useEffect(() => {
    const canvas = lineChartRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(2, 2);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const pw = w - padding.left - padding.right;
    const ph = h - padding.top - padding.bottom;

    const points = scoreHistory.map((s) => s.score);
    const min = Math.min(...points) - 10;
    const max = 100;
    const range = max - min;

    const toX = (i: number) => padding.left + (i / (points.length - 1)) * pw;
    const toY = (v: number) => padding.top + ph - ((v - min) / range) * ph;

    // Grid lines
    ctx.strokeStyle = 'rgba(42,42,58,0.8)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (ph / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + pw, y);
      ctx.stroke();
      ctx.fillStyle = '#555570';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(String(Math.round(max - ((max - min) / 4) * i)), 0, y + 4);
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + ph);
    gradient.addColorStop(0, 'rgba(124,92,255,0.3)');
    gradient.addColorStop(1, 'rgba(124,92,255,0)');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(points[0]));
    for (let i = 1; i < points.length; i++) {
      const cpX = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpX, toY(points[i - 1]), cpX, toY(points[i]), toX(i), toY(points[i]));
    }
    ctx.lineTo(toX(points.length - 1), padding.top + ph);
    ctx.lineTo(toX(0), padding.top + ph);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#7c5cff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(124,92,255,0.5)';
    ctx.moveTo(toX(0), toY(points[0]));
    for (let i = 1; i < points.length; i++) {
      const cpX = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpX, toY(points[i - 1]), cpX, toY(points[i]), toX(i), toY(points[i]));
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots
    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(toX(i), toY(points[i]), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#7c5cff';
      ctx.fill();
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, []);

  const heatmapMonths = Object.entries(studyHeatmap);

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Performance Analytics</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Detailed breakdown of your progress, scores, and study habits
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Questions Answered', value: stats.questionsAnswered.toLocaleString(), color: 'var(--primary)' },
          { label: 'Accuracy Rate', value: `${Math.round((stats.questionsCorrect / stats.questionsAnswered) * 100)}%`, color: 'var(--secondary)' },
          { label: 'Study Hours', value: `${stats.studyHoursThisWeek}h`, color: 'var(--warning)' },
          { label: 'Notes Completed', value: stats.completedNotes, color: 'var(--accent)' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Score Trend Chart */}
      <div className="card p-6">
        <h2 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Score Trend</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Last {scoreHistory.length} sessions across all subjects</p>
        <div className="h-56 w-full">
          <canvas ref={lineChartRef} className="w-full h-full" />
        </div>
      </div>

      {/* Subject performance */}
      <div className="card p-6">
        <h2 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Subject Performance</h2>
        <div className="space-y-4">
          {subjects.map((s) => {
            const score = subjectScores[s.id as keyof typeof subjectScores] ?? 0;
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: score >= 80 ? 'var(--secondary)' : score >= 60 ? 'var(--warning)' : 'var(--accent)' }}>
                    {score}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${score}%`,
                      background: score >= 80 ? 'var(--secondary)' : score >= 60 ? 'var(--warning)' : 'var(--accent)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>💪</span> Strengths
          </h2>
          <div className="space-y-2">
            {subjects
              .filter((s) => (subjectScores[s.id as keyof typeof subjectScores] ?? 0) >= 80)
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>{subjectScores[s.id as keyof typeof subjectScores]}%</span>
                </div>
              ))
            }
            {subjects.filter((s) => (subjectScores[s.id as keyof typeof subjectScores] ?? 0) >= 80).length === 0 && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Keep practicing — strengths will appear here!</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>🎯</span> Needs Work
          </h2>
          <div className="space-y-2">
            {subjects
              .filter((s) => (subjectScores[s.id as keyof typeof subjectScores] ?? 0) < 70)
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,107,157,0.1)', border: '1px solid rgba(255,107,157,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{subjectScores[s.id as keyof typeof subjectScores] ?? 0}%</span>
                    <Link href={`/subjects/${s.id}`} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,107,157,0.2)', color: 'var(--accent)', textDecoration: 'none' }}>
                      Practice
                    </Link>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Study Heatmap */}
      <div className="card p-6">
        <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Study Activity</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Daily study sessions — darker = more sessions</p>
        <div className="overflow-x-auto">
          <div className="flex gap-4">
            {heatmapMonths.map(([month, days]) => (
              <div key={month}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{month}</p>
                <div className="flex flex-wrap gap-1" style={{ width: '112px' }}>
                  {(days as number[]).map((intensity, i) => (
                    <div
                      key={i}
                      title={`Day ${i + 1}: ${intensity} sessions`}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: intensity === 0 ? 'var(--border)' : intensity === 1 ? 'rgba(124,92,255,0.3)' : 'rgba(124,92,255,0.7)',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Less</span>
          {[0, 1, 2].map((v) => (
            <div key={v} style={{ width: '12px', height: '12px', borderRadius: '2px', background: v === 0 ? 'var(--border)' : v === 1 ? 'rgba(124,92,255,0.3)' : 'rgba(124,92,255,0.7)' }} />
          ))}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>
    </div>
  );
}
