'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Step = 1 | 2 | 3;

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const GOAL_OPTIONS = [
  { id: 'top-grades', label: 'Achieve top grades', icon: '🏆' },
  { id: 'pass-exams', label: 'Pass upcoming exams', icon: '✅' },
  { id: 'improve-weak', label: 'Improve weak subjects', icon: '📈' },
  { id: 'consistent', label: 'Build consistent habits', icon: '🔥' },
  { id: 'uni-prep', label: 'Prepare for university', icon: '🎓' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  // Step 1 — personal info
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  // Step 2 — goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 3 — study plan
  const [examDate, setExamDate] = useState('');
  const [dailyQuestions, setDailyQuestions] = useState(20);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  async function handleFinish() {
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName.trim(),
        date_of_birth: dob || null,
        gender: gender || null,
        goals: selectedGoals,
        exam_date: examDate || null,
        daily_questions_goal: dailyQuestions,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  }

  const stepTitles: Record<Step, { title: string; subtitle: string }> = {
    1: { title: 'Tell us about yourself', subtitle: 'Personalise your AceStudy experience' },
    2: { title: 'What are your goals?', subtitle: 'Select everything that applies' },
    3: { title: 'Set up your study plan', subtitle: 'We\'ll keep you on track' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: '520px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), #5a3fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚡</div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.0625rem' }}>AceStudy</span>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Step {step} of 3</span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, var(--primary), #9d7aff)', width: `${(step / 3) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '520px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1.25rem', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
          {stepTitles[step].title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
          {stepTitles[step].subtitle}
        </p>

        {/* ── Step 1: Personal info ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Full name <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'var(--surface-raised)', border: '1px solid var(--border)', color: dob ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s', colorScheme: 'dark' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>
                Gender
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g === gender ? '' : g)}
                    style={{
                      padding: '0.625rem 0.875rem', borderRadius: '0.625rem', cursor: 'pointer',
                      background: gender === g ? 'rgba(124,92,255,0.15)' : 'var(--surface-raised)',
                      border: `1px solid ${gender === g ? 'var(--primary)' : 'var(--border)'}`,
                      color: gender === g ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem', fontWeight: gender === g ? 600 : 400,
                      transition: 'all 0.15s',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Goals ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {GOAL_OPTIONS.map((goal) => {
              const selected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.125rem', borderRadius: '0.875rem', cursor: 'pointer',
                    background: selected ? 'rgba(124,92,255,0.12)' : 'var(--surface-raised)',
                    border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '1.375rem', lineHeight: 1 }}>{goal.icon}</span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: selected ? 600 : 400, color: selected ? 'var(--text-primary)' : 'var(--text-secondary)', flex: 1 }}>
                    {goal.label}
                  </span>
                  {selected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Step 3: Study plan ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Next exam date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'var(--surface-raised)', border: '1px solid var(--border)', color: examDate ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 0.2s', colorScheme: 'dark' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
              <p style={{ marginTop: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>We'll build a study schedule around this.</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Daily questions target
                </label>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{dailyQuestions}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/ day</span>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={dailyQuestions}
                onChange={(e) => setDailyQuestions(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 (casual)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100 (intense)</span>
              </div>

              {/* Effort indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                {[
                  { label: 'Light', range: '5–25', icon: '🌱', active: dailyQuestions <= 25 },
                  { label: 'Moderate', range: '30–60', icon: '⚡', active: dailyQuestions > 25 && dailyQuestions <= 60 },
                  { label: 'Intense', range: '65–100', icon: '🚀', active: dailyQuestions > 60 },
                ].map((level) => (
                  <div
                    key={level.label}
                    style={{
                      padding: '0.625rem', borderRadius: '0.625rem', textAlign: 'center',
                      background: level.active ? 'rgba(124,92,255,0.12)' : 'var(--surface-raised)',
                      border: `1px solid ${level.active ? 'var(--primary)' : 'var(--border)'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{level.icon}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: level.active ? 'var(--primary)' : 'var(--text-secondary)' }}>{level.label}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{level.range}/day</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '0.625rem', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff6b6b', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              style={{
                flex: 1, padding: '0.8125rem', borderRadius: '0.75rem', cursor: 'pointer',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-active)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !fullName.trim()) {
                  setError('Please enter your name to continue.');
                  return;
                }
                setError('');
                setStep((s) => (s + 1) as Step);
              }}
              style={{
                flex: 1, padding: '0.8125rem', borderRadius: '0.75rem', cursor: 'pointer',
                background: 'var(--primary)', color: 'white',
                fontSize: '0.9375rem', fontWeight: 600, border: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              style={{
                flex: 1, padding: '0.8125rem', borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--primary), #5a3fd4)',
                color: 'white', fontSize: '0.9375rem', fontWeight: 600, border: 'none',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Saving…' : "Let's go! 🚀"}
            </button>
          )}
        </div>

        {step === 2 && (
          <p style={{ textAlign: 'center', marginTop: '0.875rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Skip this step if you prefer — you can always update later.
          </p>
        )}
      </div>
    </div>
  );
}
