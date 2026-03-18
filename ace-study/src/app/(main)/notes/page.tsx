import Link from 'next/link';
import notes from '@/data/notes.json';
import subjects from '@/data/subjects.json';

export default function NotesPage() {
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Revision Notes</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Structured notes organised by topic — read, highlight, mark complete
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => {
          const subject = subjectMap[note.subject];
          return (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card p-5 h-full cursor-pointer" style={{ borderColor: subject?.color + '33' }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{subject?.icon ?? '📄'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: subject?.color ?? 'var(--primary)' }}>
                      {subject?.name ?? note.subject}
                    </p>
                    <h2 className="font-bold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>{note.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  <span>🕐 {note.readTime}</span>
                  <span>{note.sections.length} sections</span>
                  <span>{note.keyPoints.length} key points</span>
                </div>

                <ul className="space-y-1">
                  {note.keyPoints.slice(0, 2).map((kp, i) => (
                    <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--primary)', flexShrink: 0 }}>•</span>
                      <span className="line-clamp-1">{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
