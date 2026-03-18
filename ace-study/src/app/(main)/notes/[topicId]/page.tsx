'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import notes from '@/data/notes.json';
import subjects from '@/data/subjects.json';

export default function NoteViewPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const note = notes.find((n) => n.id === topicId);
  if (!note) notFound();

  const subject = subjects.find((s) => s.id === note.subject);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState(note.sections[0]?.id ?? '');

  const toggleSection = (id: string) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allComplete = note.sections.every((s) => completedSections.has(s.id));
  const completionPercent = Math.round((completedSections.size / note.sections.length) * 100);

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <p key={i} className="mb-2 last:mb-0">{parts}</p>;
    });
  };

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/notes" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Notes</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{note.title}</span>
      </nav>

      <div className="flex gap-8">
        {/* Table of Contents */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Contents</p>
            <div className="space-y-1">
              {note.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{
                    background: activeSection === section.id ? 'var(--primary-glow)' : 'transparent',
                    color: activeSection === section.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: activeSection === section.id ? 600 : 400,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: completedSections.has(section.id) ? 'var(--secondary)' : 'var(--border)', minWidth: '1rem' }}
                  >
                    {completedSections.has(section.id) && (
                      <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  {section.title}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>Progress</span>
                <span style={{ color: 'var(--secondary)' }}>{completionPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0" style={{ maxWidth: '720px' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{subject?.icon}</span>
              <span className="text-sm font-semibold" style={{ color: subject?.color ?? 'var(--primary)' }}>{subject?.name}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{note.title}</h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span>🕐 {note.readTime} read</span>
              <span>{completedSections.size}/{note.sections.length} sections complete</span>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {note.sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="card p-6"
                style={{ borderColor: completedSections.has(section.id) ? 'var(--secondary)33' : 'var(--border)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{section.title}</h2>
                  <button
                    onClick={() => { toggleSection(section.id); setActiveSection(section.id); }}
                    className="flex-shrink-0 ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: completedSections.has(section.id) ? 'rgba(0,212,170,0.15)' : 'var(--surface-raised)',
                      color: completedSections.has(section.id) ? 'var(--secondary)' : 'var(--text-muted)',
                      border: `1px solid ${completedSections.has(section.id) ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
                    }}
                  >
                    {completedSections.has(section.id) ? '✓ Done' : 'Mark done'}
                  </button>
                </div>
                <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="card p-6 mt-6">
            <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>⚡ Key Points</h2>
            <ul className="space-y-2">
              {note.keyPoints.map((kp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', minWidth: '1.25rem' }}>{i + 1}</span>
                  {kp}
                </li>
              ))}
            </ul>
          </div>

          {/* Complete banner */}
          {allComplete && (
            <div className="mt-6 p-5 rounded-xl text-center" style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <p className="text-lg font-bold" style={{ color: 'var(--secondary)' }}>🎉 Notes complete!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Now test yourself with flashcards or practice questions</p>
            </div>
          )}

          {/* Related links */}
          <div className="flex gap-3 mt-6 flex-wrap">
            {note.relatedFlashcardDeckId && (
              <Link href={`/flashcards/${note.relatedFlashcardDeckId}`} className="btn-primary">
                📇 Study Flashcards
              </Link>
            )}
            {note.relatedTopicId && (
              <Link href={`/questions?topic=${note.relatedTopicId}`} className="btn-ghost">
                Practice Questions
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
