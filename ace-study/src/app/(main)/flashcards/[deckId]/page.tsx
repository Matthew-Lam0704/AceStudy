'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import flashcardDecks from '@/data/flashcards.json';
import subjects from '@/data/subjects.json';

type Deck = (typeof flashcardDecks)[number];
type Card = Deck['cards'][number];

export default function FlashcardStudyPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = use(params);
  const deck = flashcardDecks.find((d) => d.id === deckId);
  if (!deck) notFound();

  const subject = subjects.find((s) => s.id === deck.subject);

  const [cards, setCards] = useState<Card[]>([...deck.cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(
    new Set(deck.cards.filter((c) => c.mastered).map((c) => c.id))
  );
  const [studying, setStudying] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const currentCard = cards[currentIndex];

  const handleFlip = () => setFlipped((f) => !f);

  const nextCard = () => {
    setFlipped(false);
    if (currentIndex + 1 >= cards.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleGotIt = () => {
    setMastered((prev) => new Set([...prev, currentCard.id]));
    nextCard();
  };

  const handleStillLearning = () => {
    setStudying((prev) => new Set([...prev, currentCard.id]));
    nextCard();
  };

  const handleShuffle = () => {
    const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  const handleRestart = () => {
    setCards([...deck.cards]);
    setCurrentIndex(0);
    setFlipped(false);
    setFinished(false);
    setMastered(new Set(deck.cards.filter((c) => c.mastered).map((c) => c.id)));
    setStudying(new Set());
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); handleFlip(); }
      if (e.code === 'ArrowRight' && flipped) handleGotIt();
      if (e.code === 'ArrowLeft' && flipped) handleStillLearning();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, handleFlip, handleGotIt, handleStillLearning]);

  if (finished) {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="card p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Deck Complete!</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{deck.name}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--secondary)' }}>{mastered.size}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Got It</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{studying.size}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Studying</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--surface-raised)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{Math.round((mastered.size / cards.length) * 100)}%</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Mastery</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={handleRestart} className="btn-primary w-full">Restart Deck</button>
            <Link href="/flashcards" className="btn-ghost w-full text-center" style={{ textDecoration: 'none' }}>Back to Decks</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/flashcards" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{deck.name}</h1>
        </div>
        <button onClick={handleShuffle} className="btn-ghost text-sm">🔀 Shuffle</button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span style={{ color: 'var(--secondary)' }}>{mastered.size} mastered</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentIndex / cards.length) * 100}%`, background: subject?.color ?? 'var(--primary)' }} />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div
          className="relative w-full cursor-pointer select-none"
          style={{ maxWidth: '640px', height: '320px', perspective: '1000px' }}
          onClick={handleFlip}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
            }}
          >
            {/* Front */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 0 40px var(--primary-glow)',
              }}
            >
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Question</p>
              <p className="text-xl font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {currentCard.front}
              </p>
              <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                Tap or press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--border)' }}>Space</kbd> to flip
              </p>
            </div>

            {/* Back */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--surface-raised)',
                border: `1px solid ${subject?.color ?? 'var(--primary)'}33`,
                borderRadius: '1rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                overflowY: 'auto',
              }}
            >
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: subject?.color ?? 'var(--primary)' }}>Answer</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {flipped && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStillLearning}
            className="flex-1 py-3 rounded-xl font-bold text-sm max-w-48"
            style={{
              background: 'rgba(255,107,157,0.15)',
              border: '1px solid rgba(255,107,157,0.3)',
              color: 'var(--accent)',
            }}
          >
            ← Still Learning
          </button>
          <button
            onClick={handleGotIt}
            className="flex-1 py-3 rounded-xl font-bold text-sm max-w-48"
            style={{
              background: 'rgba(0,212,170,0.15)',
              border: '1px solid rgba(0,212,170,0.3)',
              color: 'var(--secondary)',
            }}
          >
            Got It ✓ →
          </button>
        </div>
      )}

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Space to flip · ← Still Learning · → Got It
      </p>

      <div className="flex justify-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--secondary)' }}>✅ {mastered.size} mastered</span>
        <span style={{ color: 'var(--accent)' }}>📚 {studying.size} learning</span>
        <span>{cards.length - currentIndex - 1} remaining</span>
      </div>
    </div>
  );
}
