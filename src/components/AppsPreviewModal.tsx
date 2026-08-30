import { useState, useEffect } from 'react';
import { ExternalLink, X, Smartphone, Sparkles } from 'lucide-react';

export default function AppsPreviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<'tradiepulse' | 'mathquest'>('tradiepulse');

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.app) {
        setSelectedApp(e.detail.app);
      }
      setIsOpen(true);
    };

    window.addEventListener('open-apps-modal', handleOpen);
    return () => window.removeEventListener('open-apps-modal', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const appData = {
    tradiepulse: {
      name: 'TradiePulse',
      tagline: 'Conversational AI Agent for Plain-Language Trade Triage & Proximity Matching',
      status: 'Live on Subdomain / Beta',
      description:
        'A conversational AI agent that lets customers describe household problems in plain language. The agent interprets the request, finds the nearest available and qualified tradesperson (plumber, electrician, mechanic), and connects the two.',
      features: [
        'Natural language problem understanding & qualification',
        'Real-time proximity tradie matching & job routing',
        'Supabase trade profile & availability management',
        'Dockerized service behind Caddy reverse proxy',
      ],
      techStack: ['Next.js', 'Python Agent', 'Supabase', 'PostgreSQL', 'Docker', 'Caddy', 'Tailwind'],
      metrics: 'Automated dispatch flow with sub-200ms intent matching.',
      link: 'https://tradiepulse.mainuddintalukdar.cloud',
    },
    mathquest: {
      name: 'MathQuest',
      tagline: 'Interactive Adaptive Mathematics Learning App for Primary-School Children',
      status: 'Live on Subdomain / Demo',
      description:
        'An interactive maths learning app built on Next.js, Supabase, and Vercel. Children work through puzzle lessons while the app tracks time per question, attempts, and accuracy, calling a Python microservice to score mastery and recommend next exercises.',
      features: [
        'Puzzle-based maths lessons for primary students',
        'Fine-grained engagement tracking (time, attempts, accuracy)',
        'Python scoring & practice suggestion microservice',
        'Vercel frontend with Supabase backend telemetry',
      ],
      techStack: ['Next.js', 'Python Microservice', 'Supabase', 'Vercel', 'Tailwind CSS', 'Web Audio API'],
      metrics: 'Proving end-to-end adaptive learning workflows ahead of a fully trained model.',
      link: 'https://mathquest.mainuddintalukdar.cloud',
    },
  };

  const current = appData[selectedApp];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#3b5446]/25 dark:border-[#52b788]/30 bg-white dark:bg-[#0e1c15] text-[#12221a] dark:text-[#f0f7f3] shadow-2xl transition-all animate-slide-up z-10">
        {/* Top Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e382b] via-[#52b788] to-[#95d5b2]" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-[#60796d] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* App Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-4 mb-6">
            <button
              onClick={() => setSelectedApp('tradiepulse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedApp === 'tradiepulse'
                  ? 'bg-[#1e382b] text-white dark:bg-[#2d6a4f] dark:text-white shadow-sm'
                  : 'text-[#60796d] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>TradiePulse</span>
            </button>
            <button
              onClick={() => setSelectedApp('mathquest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedApp === 'mathquest'
                  ? 'bg-[#1e382b] text-white dark:bg-[#2d6a4f] dark:text-white shadow-sm'
                  : 'text-[#60796d] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>MathQuest</span>
            </button>
          </div>

          {/* App Info Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-2xl font-bold text-[#12221a] dark:text-white tracking-tight">{current.name}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2d6a4f]/10 dark:bg-[#52b788]/15 border border-[#2d6a4f]/20 dark:border-[#52b788]/30 px-3 py-1 text-xs font-mono text-[#2d6a4f] dark:text-[#95d5b2]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#52b788] animate-pulse" />
              {current.status}
            </span>
          </div>

          <p className="text-sm font-semibold text-[#2d6a4f] dark:text-[#95d5b2] mb-3">{current.tagline}</p>
          <p className="text-sm text-[#3b5446] dark:text-[#c3d9cc] leading-relaxed mb-6">{current.description}</p>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#60796d] dark:text-[#8aa596] mb-2.5">
              Core Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {current.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#3b5446] dark:text-[#c3d9cc]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#52b788]" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#60796d] dark:text-[#8aa596] mb-2">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {current.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#f4f8f5] dark:bg-[#12241b] border border-[#3b5446]/15 dark:border-[#52b788]/20 px-3 py-1 text-xs font-mono text-[#2d4d3c] dark:text-[#c3d9cc]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Impact Metric & Link */}
          <div className="rounded-2xl border border-[#52b788]/30 bg-[#52b788]/10 p-4 mb-6">
            <p className="text-xs text-[#1e382b] dark:text-[#d8e8dc] font-medium">
              <strong>Measured Impact:</strong> {current.metrics}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#3b5446]/20 dark:border-[#52b788]/30 bg-[#f4f8f5] dark:bg-[#12241b] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] px-4 py-2 text-xs font-bold text-[#12221a] dark:text-white transition"
            >
              Close
            </button>
            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1e382b] hover:bg-[#284a39] dark:bg-[#2d6a4f] dark:hover:bg-[#388261] px-5 py-2 text-xs font-bold text-white shadow-md transition"
            >
              <span>Explore Live Subdomain</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
