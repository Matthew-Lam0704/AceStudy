'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const sparkGreenRef = useRef<HTMLCanvasElement>(null);
  const sparkRedRef = useRef<HTMLCanvasElement>(null);
  const progressChartRef = useRef<HTMLCanvasElement>(null);

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
      ctx.moveTo(0, h - (trend[0] * h));
      
      for (let i = 1; i < trend.length; i++) {
        ctx.lineTo(i * step, h - (trend[i] * h));
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
      const points = [0.4, 0.3, 0.5, 0.45, 0.7, 0.65, 0.85, 0.8];
      
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, 'rgba(0, 245, 212, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 245, 212, 0)');
      
      ctx.beginPath();
      ctx.moveTo(0, h);
      
      const step = w / (points.length - 1);
      
      ctx.beginPath();
      ctx.strokeStyle = '#00F5D4';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 245, 212, 0.5)';
      
      ctx.moveTo(0, h - (points[0] * h));
      for (let i = 1; i < points.length; i++) {
        const x = i * step;
        const y = h - (points[i] * h);
        const prevX = (i - 1) * step;
        const prevY = h - (points[i-1] * h);
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

    if (sparkGreenRef.current) drawSparkline(sparkGreenRef.current, '#00F5D4', [0.2, 0.4, 0.3, 0.6, 0.5, 0.8]);
    if (sparkRedRef.current) drawSparkline(sparkRedRef.current, '#FF5D5D', [0.8, 0.6, 0.7, 0.4, 0.5, 0.3]);
    drawMainChart();

    window.addEventListener('resize', drawMainChart);
    return () => window.removeEventListener('resize', drawMainChart);
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* TopHeader */}
      <header className="flex items-center justify-between px-6 py-8" data-purpose="header-container">
        <div className="w-12 h-12 rounded-full neu-surface flex items-center justify-center p-1" data-purpose="user-avatar">
          <img alt="Avatar" className="rounded-full w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXcwD0uN6ZMTso4SgluOwSO7wAIrRE4wbC8mpEuE8VQ2OWr3n6WclMsLioOdxiM67w2sFnL0xz8M2FG5A00S9cbnllW2jMb_Vf67f7wzQHEqSj4rWTj8quK_25FeMRRIKTy7wt0pfrhlYEiGNwj-RRvZ6cxBa0IidvGddH0cIaxAQ-KMfn6XXu4aQtT2XJBX_P4XlqTmBJpU6t227DTYMl5mx-yhUjOF0xKUwdJHcCKJ2d8ygJFl-HfC6oELaWqgVLqaKulFnozqa8" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Dashboard</h1>
        <Link href="/payment" className="w-10 h-10 rounded-full neu-surface flex items-center justify-center text-mint-green hover:shadow-neu-button-pressed transition-all" data-purpose="add-button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </Link>
      </header>

      {/* SubjectTabBar */}
      <nav className="px-6 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide" data-purpose="navigation-tabs">
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-full neu-surface text-sm font-medium text-slate-400">
            - Maths
          </button>
          <button className="px-6 py-2 rounded-full neu-surface text-sm font-bold text-mint-green ring-1 ring-mint-green/30">
            • Biology
          </button>
          <button className="px-6 py-2 rounded-full neu-surface text-sm font-medium text-slate-400">
            - Chemistry
          </button>
        </div>
      </nav>

      {/* StatsSection */}
      <section className="px-6 grid grid-cols-2 gap-6 mb-8" data-purpose="stats-summary">
        {/* Completed Notes Card */}
        <div className="neu-surface rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Completed notes</span>
            <div className="text-2xl font-bold mt-1">34</div>
          </div>
          <div className="mt-4 h-8 flex items-end">
            <canvas ref={sparkGreenRef} data-purpose="sparkline-canvas" height="30" width="100"></canvas>
          </div>
        </div>
        {/* Questions Left Card */}
        <div className="neu-surface rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">Questions left</span>
            <div className="text-2xl font-bold mt-1">120</div>
          </div>
          <div className="mt-4 h-8 flex items-end">
            <canvas ref={sparkRedRef} data-purpose="sparkline-canvas" height="30" width="100"></canvas>
          </div>
        </div>
      </section>

      {/* ChartCard */}
      <section className="px-6 mb-8" data-purpose="performance-chart">
        <div className="neu-surface rounded-[2rem] p-6 relative overflow-hidden">
          {/* Toggle Filter */}
          <div className="flex justify-center mb-6">
            <div className="neu-inset-surface rounded-full p-1 flex w-full max-w-[240px]">
              <button className="flex-1 py-1 text-xs font-semibold text-slate-400">Day</button>
              <button className="flex-1 py-1 text-xs font-semibold text-slate-400">Week</button>
              <button className="flex-1 py-1 text-xs font-bold text-mint-green bg-slate-gray shadow-neu-flat-sm rounded-full">Month</button>
            </div>
          </div>
          {/* Score Display */}
          <div className="mb-4">
            <p className="text-slate-400 text-sm">Average Score</p>
            <p className="text-4xl font-bold text-mint-green glow-text">85%</p>
          </div>
          {/* Main Progress Chart */}
          <div className="h-40 w-full relative">
            <canvas ref={progressChartRef} className="w-full h-full" data-purpose="progress-chart-canvas"></canvas>
          </div>
        </div>
      </section>

      {/* PrimaryAction */}
      <section className="px-6 mb-10" data-purpose="main-action">
        <button className="w-full py-5 rounded-2xl neu-surface bg-slate-gray font-bold text-mint-green tracking-wide text-lg active:shadow-neu-inset transition-all border border-mint-green/10">
          Continue Mock Exam
        </button>
      </section>

      {/* RecentActivity */}
      <section className="px-6" data-purpose="activity-feed">
        <h2 className="text-sm font-semibold text-slate-400 mb-4 px-2">Today, 2 March</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 neu-surface rounded-2xl" data-purpose="activity-item">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full neu-inset-surface flex items-center justify-center text-teal-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm">Biology Flashcards</h3>
                <p className="text-xs text-slate-500">10:30 AM</p>
              </div>
            </div>
            <div className="text-mint-green font-bold text-sm">+5%</div>
          </div>

          <div className="flex items-center justify-between p-4 neu-surface rounded-2xl" data-purpose="activity-item">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full neu-inset-surface flex items-center justify-center text-mint-green">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm">Maths Target Test</h3>
                <p className="text-xs text-slate-500">Yesterday</p>
              </div>
            </div>
            <div className="text-mint-green font-bold text-sm">+5%</div>
          </div>
        </div>
      </section>
    </div>
  );
}
