import Link from 'next/link';
import { notFound } from 'next/navigation';
import subjects from '@/data/subjects.json';
import topicsData from '@/data/topics.json';

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) notFound();

  const topics = (topicsData as Record<string, typeof topicsData['biology']>)[subjectId] ?? [];

  return (
    <div className="page-enter space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <Link href="/subjects" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Subjects</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{subject.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
          style={{ background: subject.color + '20', border: `1px solid ${subject.color}33` }}
        >
          {subject.icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{subject.name}</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{subject.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {subject.examBoards.map((board) => (
              <span key={board} className="badge badge-primary">{board}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Topics', value: subject.topicCount },
          { label: 'Questions', value: subject.questionCount },
          { label: 'Notes', value: subject.notesCount },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: subject.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Topic tree */}
      {topics.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Topics</h2>
          {topics.map((topic) => (
            <div key={topic.id} className="card p-5">
              {/* Topic header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: topic.color }} />
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{topic.name}</h3>
                </div>
                <span className="text-sm font-semibold" style={{ color: topic.color }}>{topic.completionPercent}%</span>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: `${topic.completionPercent}%`, background: topic.color }} />
              </div>

              {/* Subtopics */}
              <div className="space-y-2">
                {topic.subtopics.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{ background: 'var(--surface-raised)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: sub.completed ? 'var(--secondary)' : 'var(--border)',
                          color: sub.completed ? '#000' : 'var(--text-muted)',
                        }}
                      >
                        {sub.completed && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Link href={`/notes/${sub.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        {sub.notesCount} notes
                      </Link>
                      <Link href={`/questions?topic=${sub.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        {sub.questionsCount} Qs
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p style={{ color: 'var(--text-muted)' }}>Topics for {subject.name} coming soon!</p>
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap gap-3">
        <Link href={`/flashcards?subject=${subjectId}`} className="btn-primary">
          📇 Study Flashcards
        </Link>
        <Link href={`/questions?subject=${subjectId}`} className="btn-ghost">
          Practice Questions
        </Link>
        <Link href={`/mocks?subject=${subjectId}`} className="btn-ghost">
          Mock Exams
        </Link>
      </div>
    </div>
  );
}
