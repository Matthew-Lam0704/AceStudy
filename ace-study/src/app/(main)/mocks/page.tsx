import Link from 'next/link';
import mocks from '@/data/mocks.json';
import subjects from '@/data/subjects.json';

export default async function MocksPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; type?: string }>;
}) {
  const { subject: filterSubject, type: filterType } = await searchParams;
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  const filtered = mocks.filter((m) => {
    if (filterSubject && m.subject !== filterSubject) return false;
    if (filterType && m.type !== filterType) return false;
    return true;
  });

  const typeColors: Record<string, string> = {
    full: 'var(--primary)',
    mini: 'var(--secondary)',
    diagnostic: 'var(--warning)',
  };

  const typeLabels: Record<string, string> = {
    full: 'Full Mock',
    mini: 'Mini Mock',
    diagnostic: 'Diagnostic',
  };

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Mock Exams</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Timed exam simulations with automatic marking and detailed results
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['full', 'mini', 'diagnostic'].map((t) => (
          <Link
            key={t}
            href={`/mocks?type=${t}`}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
            style={{
              background: filterType === t ? typeColors[t] + '20' : 'var(--surface)',
              color: filterType === t ? typeColors[t] : 'var(--text-secondary)',
              border: `1px solid ${filterType === t ? typeColors[t] + '50' : 'var(--border)'}`,
              textDecoration: 'none',
            }}
          >
            {typeLabels[t]}
          </Link>
        ))}
        {subjects.slice(0, 3).map((s) => (
          <Link
            key={s.id}
            href={`/mocks?subject=${s.id}`}
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
        {(filterSubject || filterType) && (
          <Link href="/mocks" className="px-3 py-1.5 rounded-full text-xs" style={{ color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid var(--border)' }}>
            × Clear
          </Link>
        )}
      </div>

      {/* Mock cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mock) => {
          const subject = subjectMap[mock.subject];
          const typeColor = typeColors[mock.type];
          return (
            <div key={mock.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{subject?.icon ?? '📋'}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: typeColor + '20', color: typeColor }}>
                  {typeLabels[mock.type]}
                </span>
              </div>

              <h2 className="font-bold mb-1 leading-snug" style={{ color: 'var(--text-primary)' }}>{mock.title}</h2>
              <p className="text-xs mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{mock.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                <div className="p-2 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{mock.duration}m</p>
                  <p>Duration</p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{mock.questionCount}</p>
                  <p>Questions</p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
                  {mock.bestScore !== null ? (
                    <>
                      <p className="font-bold text-base" style={{ color: subject?.color ?? 'var(--primary)' }}>{mock.bestScore}%</p>
                      <p>Best</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-base" style={{ color: 'var(--text-muted)' }}>—</p>
                      <p>Not taken</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`badge badge-${mock.difficulty}`}>{mock.difficulty}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{mock.examBoard} · {mock.attempts} attempts</span>
              </div>

              <Link
                href={`/mocks/${mock.id}`}
                className="btn-primary w-full text-center py-3 text-sm"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {mock.attempts > 0 ? '🔄 Retake Exam' : '▶ Start Exam'}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
