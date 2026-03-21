'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import questions from '@/data/questions.json';
import subjects from '@/data/subjects.json';

export default function QuestionPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = use(params);
  const question = questions.find((q) => q.id === questionId);
  if (!question) notFound();

  const subject = subjects.find((s) => s.id === question.subject);
  const questionIndex = questions.findIndex((q) => q.id === questionId);
  const nextQuestion = questions[questionIndex + 1];
  const prevQuestion = questions[questionIndex - 1];

  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState(false);

  const isCorrect = selected === question.correctAnswer;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
    setShowMarkScheme(false);
  };

  return (
    <div className="page-enter" style={{ maxWidth: '720px' }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/questions" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Questions</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Q{questionIndex + 1}</span>
      </nav>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm px-2.5 py-1 rounded-full" style={{ background: subject?.color + '20', color: subject?.color }}>
          {subject?.icon} {subject?.name}
        </span>
        <span className={`badge badge-${question.difficulty}`}>{question.difficulty}</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>⏱ avg {question.averageTimeSeconds}s</span>
      </div>

      {/* Question */}
      <div className="card p-6 mb-6">
        <p className="text-lg font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {(question.options ?? []).map((option, i) => {
          let borderColor = 'var(--border)';
          let bg = 'var(--surface)';
          let textColor = 'var(--text-primary)';

          if (submitted) {
            if (i === question.correctAnswer) {
              borderColor = 'var(--secondary)';
              bg = 'rgba(0,212,170,0.1)';
              textColor = 'var(--secondary)';
            } else if (i === selected && selected !== question.correctAnswer) {
              borderColor = 'var(--accent)';
              bg = 'rgba(255,107,157,0.1)';
              textColor = 'var(--accent)';
            }
          } else if (selected === i) {
            borderColor = 'var(--primary)';
            bg = 'var(--primary-glow)';
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className="w-full text-left p-4 rounded-xl flex items-start gap-3 transition-all"
              style={{ background: bg, border: `1px solid ${borderColor}`, color: textColor, cursor: submitted ? 'default' : 'pointer' }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  background: selected === i && !submitted ? 'var(--primary)' : submitted && i === question.correctAnswer ? 'var(--secondary)' : 'var(--border)',
                  color: (selected === i && !submitted) || (submitted && i === question.correctAnswer) ? '#fff' : 'var(--text-muted)',
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Submit or Result */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="btn-primary w-full py-3"
          style={{ opacity: selected === null ? 0.5 : 1 }}
        >
          Submit Answer
        </button>
      ) : (
        <div className="space-y-4">
          {/* Result banner */}
          <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{
              background: isCorrect ? 'rgba(0,212,170,0.1)' : 'rgba(255,107,157,0.1)',
              border: `1px solid ${isCorrect ? 'rgba(0,212,170,0.3)' : 'rgba(255,107,157,0.3)'}`,
            }}
          >
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className="font-bold" style={{ color: isCorrect ? 'var(--secondary)' : 'var(--accent)' }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Correct answer: <strong>{question.options?.[question.correctAnswer as number]}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Explanation</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{question.explanation}</p>
          </div>

          {/* Mark scheme toggle */}
          <button onClick={() => setShowMarkScheme(!showMarkScheme)} className="btn-ghost w-full text-sm">
            {showMarkScheme ? 'Hide' : 'Show'} Mark Scheme
          </button>
          {showMarkScheme && (
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Mark Scheme</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{question.markScheme}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button onClick={handleReset} className="btn-ghost flex-1">Try Again</button>
            {nextQuestion ? (
              <Link href={`/questions/${nextQuestion.id}`} className="btn-primary flex-1 text-center" style={{ textDecoration: 'none' }}>
                Next Question →
              </Link>
            ) : (
              <Link href="/questions" className="btn-primary flex-1 text-center" style={{ textDecoration: 'none' }}>
                All Questions
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Prev / Next nav */}
      <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        {prevQuestion ? (
          <Link href={`/questions/${prevQuestion.id}`} className="btn-ghost text-sm" style={{ textDecoration: 'none' }}>← Previous</Link>
        ) : <div />}
        {nextQuestion ? (
          <Link href={`/questions/${nextQuestion.id}`} className="btn-ghost text-sm" style={{ textDecoration: 'none' }}>Next →</Link>
        ) : <div />}
      </div>
    </div>
  );
}
