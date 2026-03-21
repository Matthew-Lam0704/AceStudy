'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mocks from '@/data/mocks.json';
import questions from '@/data/questions.json';
import subjects from '@/data/subjects.json';

type ExamState = 'pre' | 'active' | 'results';

export default function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);
  const mock = mocks.find((m) => m.id === examId);
  if (!mock) notFound();

  const subject = subjects.find((s) => s.id === mock.subject);
  const examQuestions = questions.filter((q) => mock.questionIds.includes(q.id));

  const [examState, setExamState] = useState<ExamState>('pre');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(mock.duration * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const currentQuestion = examQuestions[currentIndex];

  useEffect(() => {
    if (examState === 'active') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setExamState('results');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [examState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const endExam = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setExamState('results');
  };

  const toggleFlag = (id: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const score = examQuestions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const scorePercent = examQuestions.length > 0 ? Math.round((score / examQuestions.length) * 100) : 0;
  const timeLow = timeLeft < 300;

  // Pre-exam screen
  if (examState === 'pre') {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-[70vh]">
        <div className="card p-10 max-w-lg w-full text-center space-y-6">
          <span className="text-5xl">{subject?.icon ?? '📋'}</span>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{mock.title}</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{mock.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            {[
              { label: 'Time limit', value: `${mock.duration}m` },
              { label: 'Questions', value: examQuestions.length },
              { label: 'Board', value: mock.examBoard },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl" style={{ background: 'var(--surface-raised)' }}>
                <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{s.value}</p>
                <p style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <ul className="text-sm text-left space-y-2" style={{ color: 'var(--text-secondary)' }}>
            {[
              'Timer starts when you begin',
              'You can flag questions to review',
              'Navigate freely between questions',
              'Exam auto-submits when time runs out',
            ].map((rule) => (
              <li key={rule} className="flex items-center gap-2">
                <span style={{ color: 'var(--secondary)' }}>•</span>{rule}
              </li>
            ))}
          </ul>

          <button onClick={() => setExamState('active')} className="btn-primary w-full py-4 text-lg">
            Begin Exam ▶
          </button>
          <Link href="/mocks" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Mocks
          </Link>
        </div>
      </div>
    );
  }

  // Results screen
  if (examState === 'results') {
    return (
      <div className="page-enter space-y-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Exam Results</h1>

        <div className="card p-8 text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{mock.title}</p>
          <div
            className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4"
            style={{
              borderColor: scorePercent >= 70 ? 'var(--secondary)' : scorePercent >= 50 ? 'var(--warning)' : 'var(--accent)',
            }}
          >
            <p className="text-4xl font-black" style={{ color: scorePercent >= 70 ? 'var(--secondary)' : scorePercent >= 50 ? 'var(--warning)' : 'var(--accent)' }}>
              {scorePercent}%
            </p>
          </div>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{score} / {examQuestions.length} correct</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {scorePercent >= 80 ? '🌟 Excellent work!' : scorePercent >= 60 ? '👍 Good effort — keep practicing!' : '📚 More revision recommended'}
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Answer Review</h2>
          <div className="space-y-3">
            {examQuestions.map((q, i) => {
              const answered = answers[q.id] !== undefined;
              const correct = answers[q.id] === q.correctAnswer;
              return (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: !answered ? 'var(--border)' : correct ? 'rgba(0,212,170,0.2)' : 'rgba(255,107,157,0.2)',
                      color: !answered ? 'var(--text-muted)' : correct ? 'var(--secondary)' : 'var(--accent)',
                    }}
                  >
                    {!answered ? '—' : correct ? '✓' : '✗'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Q{i + 1}: {q.question.slice(0, 80)}{q.question.length > 80 ? '…' : ''}</p>
                    {!correct && answered && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Correct: {q.options?.[q.correctAnswer as number]}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/mocks" className="btn-ghost flex-1 text-center" style={{ textDecoration: 'none' }}>Back to Mocks</Link>
          <Link href="/analytics" className="btn-primary flex-1 text-center" style={{ textDecoration: 'none' }}>View Analytics</Link>
        </div>
      </div>
    );
  }

  // Active exam
  return (
    <div className="page-enter space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
          Q{currentIndex + 1} / {examQuestions.length}
        </p>
        <div
          className="font-black text-2xl tabular-nums px-4 py-1.5 rounded-lg"
          style={{
            color: timeLow ? 'var(--accent)' : 'var(--text-primary)',
            background: timeLow ? 'rgba(255,107,157,0.15)' : 'var(--surface-raised)',
          }}
        >
          {formatTime(timeLeft)}
        </div>
        <button
          onClick={() => setShowEndConfirm(true)}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,107,157,0.15)', color: 'var(--accent)', border: '1px solid rgba(255,107,157,0.3)' }}
        >
          End Exam
        </button>
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-2">
        {examQuestions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center"
            style={{
              background: i === currentIndex ? 'var(--primary)' : answers[q.id] !== undefined ? 'rgba(0,212,170,0.2)' : 'var(--surface-raised)',
              color: i === currentIndex ? '#fff' : answers[q.id] !== undefined ? 'var(--secondary)' : 'var(--text-muted)',
              border: flagged.has(q.id) ? '2px solid var(--warning)' : '1px solid var(--border)',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      {currentQuestion && (
        <>
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-lg font-semibold leading-relaxed flex-1" style={{ color: 'var(--text-primary)' }}>
                {currentQuestion.question}
              </p>
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className="ml-3 p-2 rounded-lg flex-shrink-0"
                style={{
                  background: flagged.has(currentQuestion.id) ? 'rgba(255,181,71,0.2)' : 'var(--surface-raised)',
                  color: flagged.has(currentQuestion.id) ? 'var(--warning)' : 'var(--text-muted)',
                }}
              >
                🚩
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(currentQuestion.options ?? []).map((option, i) => (
              <button
                key={i}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: i }))}
                className="w-full text-left p-4 rounded-xl flex items-start gap-3 transition-all"
                style={{
                  background: answers[currentQuestion.id] === i ? 'var(--primary-glow)' : 'var(--surface)',
                  border: `1px solid ${answers[currentQuestion.id] === i ? 'var(--primary)' : 'var(--border)'}`,
                  color: 'var(--text-primary)',
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: answers[currentQuestion.id] === i ? 'var(--primary)' : 'var(--border)',
                    color: answers[currentQuestion.id] === i ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="btn-ghost flex-1"
              style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                if (currentIndex + 1 >= examQuestions.length) setShowEndConfirm(true);
                else setCurrentIndex((i) => i + 1);
              }}
              className="btn-primary flex-1"
            >
              {currentIndex + 1 >= examQuestions.length ? 'Finish →' : 'Next →'}
            </button>
          </div>
        </>
      )}

      {/* End confirm modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="card p-8 max-w-sm w-full text-center space-y-4">
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>End Exam?</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {Object.keys(answers).length} of {examQuestions.length} questions answered.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowEndConfirm(false)} className="btn-ghost flex-1">Continue</button>
              <button
                onClick={endExam}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,107,157,0.2)', color: 'var(--accent)', border: '1px solid rgba(255,107,157,0.3)' }}
              >
                End Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
