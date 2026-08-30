import { describe, it, expect } from 'vitest';
import { classifyIntentHeuristic, analyzeIntent } from '@/lib/ai-intent';

describe('AI Intent Classification & Heuristics', () => {
  it('classifies recruiter hiring intent accurately', async () => {
    const text = 'We are hiring a Lead AI / Full-Stack Engineer for our cloud team and want to review your CV.';
    const result = classifyIntentHeuristic(text);

    expect(result.category).toBe('Recruiter');
    expect(result.score).toBeGreaterThanOrEqual(0.8);
    expect(result.summary).toContain('recruiter');
  });

  it('classifies client/project inquiry accurately', async () => {
    const text = 'We need architectural consulting to build an MVP for our SaaS startup.';
    const result = classifyIntentHeuristic(text);

    expect(result.category).toBe('Client');
    expect(result.score).toBeGreaterThanOrEqual(0.8);
  });

  it('classifies peer/collaboration inquiry accurately', async () => {
    const text = 'I am also building AI agents with Claude Code and Antigravity, looking to connect and compare notes.';
    const result = classifyIntentHeuristic(text);

    expect(result.category).toBe('Engineering Peer');
    expect(result.score).toBeGreaterThanOrEqual(0.7);
  });

  it('flags spam or suspicious promotional text', async () => {
    const spamText = 'Boost your SEO ranking and buy crypto backlinks today!';
    const result = classifyIntentHeuristic(spamText);

    expect(result.category).toBe('Spam');
    expect(result.score).toBeGreaterThanOrEqual(0.9);
  });

  it('flags ultra short texts as Spam', async () => {
    const shortText = 'abc';
    const result = classifyIntentHeuristic(shortText);

    expect(result.category).toBe('Spam');
  });

  it('handles empty input in analyzeIntent without throwing', async () => {
    const result = await analyzeIntent('');
    expect(result.category).toBe('Spam');
  });
});
