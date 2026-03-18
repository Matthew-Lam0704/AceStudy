import Link from 'next/link';
import subjects from '@/data/subjects.json';
import userProgress from '@/data/user-progress.json';

export default function SubjectsPage() {
  const { subjectScores } = userProgress;

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Subjects</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select a subject to explore topics, notes, and questions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subject, i) => {
          const score = subjectScores[subject.id as keyof typeof subjectScores] ?? 0;
          return (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              style={{
                textDecoration: 'none',
                display: 'block',
                animation: `fadeSlideUp ${0.1 + i * 0.05}s ease-out`,
              }}
            >
              <div
                className="card p-6 h-full cursor-pointer"
                style={{ borderColor: subject.color + '33' }}
              >
                {/* Icon + Score */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: subject.color + '20', border: `1px solid ${subject.color}33` }}
                  >
                    {subject.icon}
                  </div>
                  {score > 0 && (
                    <span
                      className="text-sm font-bold px-2.5 py-1 rounded-full"
                      style={{ background: subject.color + '20', color: subject.color }}
                    >
                      {score}%
                    </span>
                  )}
                </div>

                <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{subject.name}</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{subject.description}</p>

                {/* Stats */}
                <div className="flex gap-4 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{subject.topicCount} topics</span>
                  <span>{subject.questionCount} questions</span>
                  <span>{subject.notesCount} notes</span>
                </div>

                {/* Progress bar */}
                {score > 0 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${score}%`, background: subject.color }} />
                  </div>
                )}

                {/* Exam boards */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {subject.examBoards.slice(0, 4).map((board) => (
                    <span key={board} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{board}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
