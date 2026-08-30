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
      tagline: 'All-in-One Operations & Job Management Platform for Trade Businesses',
      status: 'Live Beta / Enterprise Pilot',
      description:
        'TradiePulse empowers trade professionals (plumbers, electricians, builders) with real-time job dispatching, instant quotes, automated client SMS updates, and inventory tracking. Built for low latency and high offline resilience in the field.',
      features: [
        'Real-time job scheduling & dispatch map',
        'Instant quoting & invoice generation',
        'Automated SMS notifications for client arrival',
        'Offline-first mobile sync architecture',
      ],
      techStack: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'AWS S3'],
      metrics: 'Over 40% reduction in admin overhead during pilot trials.',
      link: 'https://tradiepulse.cloud',
    },
    mathquest: {
      name: 'MathQuest',
      tagline: 'Gamified Adaptive Mathematics Learning Engine for Students',
      status: 'Production / Active Rollout',
      description:
        'MathQuest turns foundational mathematics education into an engaging role-playing quest. An adaptive difficulty engine personalizes problem sets to each student’s mastery level, diagnosing learning gaps in real-time.',
      features: [
        'Adaptive problem difficulty adjustment algorithm',
        'Gamified quests, badges, and learning streaks',
        'Educator analytics dashboard with mastery heatmaps',
        'Accessible multi-device interactive canvas',
      ],
      techStack: ['Astro', 'React', 'Tailwind CSS', 'Supabase', 'Web Audio API'],
      metrics: 'Engaged over 1,200 active learners with a 92% completion rate on quest challenges.',
      link: 'https://mathquest.cloud',
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

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/70 bg-[#0b0f17] text-slate-100 shadow-2xl shadow-indigo-950/50 transition-all animate-slide-up z-10">
        {/* Top Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* App Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setSelectedApp('tradiepulse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedApp === 'tradiepulse'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>TradiePulse</span>
            </button>
            <button
              onClick={() => setSelectedApp('mathquest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedApp === 'mathquest'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>MathQuest</span>
            </button>
          </div>

          {/* App Info Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{current.name}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {current.status}
            </span>
          </div>

          <p className="text-sm font-medium text-indigo-400 mb-4">{current.tagline}</p>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">{current.description}</p>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Core Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {current.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Impact Metric & Link */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 mb-6">
            <p className="text-xs text-indigo-300 font-medium">
              <strong>Measured Impact:</strong> {current.metrics}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm text-slate-300 transition"
            >
              Close
            </button>
            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition"
            >
              <span>Explore Application</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
