import Link from 'next/link';
import questions from '@/data/questions.json';
import subjects from '@/data/subjects.json';

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; difficulty?: string }>;
}) {
  const { subject: filterSubject, difficulty: filterDifficulty } = await searchParams;
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  const filtered = questions.filter((q) => {
    if (filterSubject && q.subject !== filterSubject) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  const difficultyColors: Record<string, string> = {
    easy: 'var(--secondary)',
    medium: 'var(--warning)',
    hard: 'var(--accent)',
  };

  return (
    <div className="page-enter space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Practice Questions</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} questions available
          </p>
        </div>
        <Link href="/questions/q_001" className="btn-primary hidden sm:inline-flex items-center gap-2">
          ⚡ Quick Practice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {subjects.slice(0, 4).map((s) => (
            <Link
              key={s.id}
              href={`/questions?subject=${s.id}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: filterSubject === s.id ? s.color + '20' : 'var(--surface)',
                color: filterSubject === s.id ? s.color : 'var(--text-secondary)',
                border: `1px solid ${filterSubject === s.id ? s.color + '50' : 'var(--border)'}`,
                textDecoration: 'none',
              }}
            >
              {s.icon} {s.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map((d) => (
            <Link
              key={d}
              href={`/questions?difficulty=${d}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
              style={{
                background: filterDifficulty === d ? difficultyColors[d] + '20' : 'var(--surface)',
                color: filterDifficulty === d ? difficultyColors[d] : 'var(--text-secondary)',
                border: `1px solid ${filterDifficulty === d ? difficultyColors[d] + '50' : 'var(--border)'}`,
                textDecoration: 'none',
              }}
            >
              {d}
            </Link>
          ))}
        </div>
        {(filterSubject || filterDifficulty) && (
          <Link href="/questions" className="px-3 py-1.5 rounded-full text-xs" style={{ color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid var(--border)' }}>
            × Clear filters
          </Link>
        )}
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {filtered.map((q, i) => {
          const subject = subjectMap[q.subject];
          return (
            <Link key={q.id} href={`/questions/${q.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="card p-4 cursor-pointer">
                <div className="flex items-start gap-4">
                  <span className="text-sm font-bold flex-shrink-0 w-8 text-center py-0.5 rounded" style={{ background: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {q.question}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: subject?.color + '20', color: subject?.color }}>
                        {subject?.icon} {subject?.name}
                      </span>
                      <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⏱ avg {q.averageTimeSeconds}s</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
