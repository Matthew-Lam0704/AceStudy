import Link from 'next/link';
import flashcardDecks from '@/data/flashcards.json';
import subjects from '@/data/subjects.json';

export default function FlashcardsPage() {
  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  return (
    <div className="page-enter space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Flashcards</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Spaced repetition flashcard decks — flip, sort, and master your topics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {flashcardDecks.map((deck) => {
          const subject = subjectMap[deck.subject];
          const masteryPercent = Math.round((deck.masteredCount / deck.cardCount) * 100);
          return (
            <Link key={deck.id} href={`/flashcards/${deck.id}`} style={{ textDecoration: 'none' }}>
              <div className="card p-5 h-full cursor-pointer" style={{ borderColor: subject?.color + '33' }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{subject?.icon ?? '📇'}</span>
                  <span
                    className="text-sm font-bold px-2.5 py-1 rounded-full"
                    style={{ background: subject?.color + '20', color: subject?.color ?? 'var(--primary)' }}
                  >
                    {masteryPercent}% mastered
                  </span>
                </div>
                <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{deck.name}</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{deck.description}</p>
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  <span>{deck.cardCount} cards</span>
                  <span>✅ {deck.masteredCount} mastered</span>
                  <span>📚 {deck.cardCount - deck.masteredCount} remaining</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${masteryPercent}%`, background: subject?.color ?? 'var(--primary)' }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
