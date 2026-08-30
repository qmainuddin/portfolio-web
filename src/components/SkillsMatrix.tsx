import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface SkillItem {
  id: string;
  category: 'ai' | 'cloud' | 'frontend' | 'backend' | 'leadership';
  title: string;
  recency: string;
  summary: string;
  keywords: string[];
}

const skillsData: SkillItem[] = [
  {
    id: 'ai-agents',
    category: 'ai',
    title: 'Agentic AI & LLM Systems',
    recency: 'Active Production (2024–2026)',
    summary:
      'Architecting multi-agent swarms, deterministic state machines, AST-aware code refactoring agents, prompt caching, and cost-governed tool calling pipelines.',
    keywords: ['Claude Code', 'Antigravity SDK', 'OpenAI Codex', 'Gemini Live', 'LangChain', 'Agentic Workflows', 'Prompt Caching', 'Vector Embeddings'],
  },
  {
    id: 'cloud-infra',
    category: 'cloud',
    title: 'Cloud & Distributed Architecture',
    recency: 'Active Production',
    summary:
      'High-throughput asynchronous event-driven pipelines, serverless compute, minimal-overhead container networks, and reverse proxy routing.',
    keywords: ['AWS SQS', 'AWS EC2', 'AWS Lambda', 'GCP Cloud Run', 'Caddy Reverse Proxy', 'Docker Multi-stage', 'Hostinger VPS', 'Cloudflare CDN'],
  },
  {
    id: 'fullstack-web',
    category: 'frontend',
    title: 'Full-Stack Web & SSR Platforms',
    recency: 'Active Production',
    summary:
      'High-speed server-rendered web applications with zero unnecessary client JS, island architecture, and accessible micro-interactions.',
    keywords: ['Astro 5', 'React 18/19', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite', 'Responsive UX', 'Web Vitals / CWV'],
  },
  {
    id: 'databases',
    category: 'backend',
    title: 'Databases & Storage Engines',
    recency: 'Active Production',
    summary:
      'Relational PostgreSQL schema design, Row-Level Security (RLS) enforcement, Redis caching layers, and secure object storage management.',
    keywords: ['Supabase', 'PostgreSQL', 'Redis', 'Supabase Storage', 'Prisma', 'Drizzle ORM', 'SQL Indexing', 'ACID Transactions'],
  },
  {
    id: 'devops-ci',
    category: 'cloud',
    title: 'DevOps, CI/CD & Automated QA',
    recency: 'Active Production',
    summary:
      'Test-Driven Development (TDD) pipelines, automated SSH release orchestration, Docker containerization, and zero-downtime rolling updates.',
    keywords: ['GitHub Actions', 'Docker Compose', 'Vitest', 'Playwright', 'Makefile Automation', 'Automated Healthchecks', 'SSH Deployment'],
  },
  {
    id: 'leadership',
    category: 'leadership',
    title: 'Engineering Leadership & Product Strategy',
    recency: 'Continuous Practice',
    summary:
      'Translating ambiguous product goals into deterministic roadmaps, architecting high-leverage developer workflows, and conducting rigorous code reviews.',
    keywords: ['System Architecture', 'Cost-Benefit Analysis', 'Cross-Functional Strategy', 'Mentorship', 'TDD Best Practices', 'Security Hardening'],
  },
];

export default function SkillsMatrix() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'cloud' | 'frontend' | 'backend' | 'leadership'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = useMemo(() => {
    return skillsData.filter(skill => {
      const matchesFilter = activeFilter === 'all' || skill.category === activeFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        skill.title.toLowerCase().includes(query) ||
        skill.summary.toLowerCase().includes(query) ||
        skill.keywords.some(k => k.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'ai', label: 'AI & Agents' },
    { id: 'cloud', label: 'Cloud & DevOps' },
    { id: 'frontend', label: 'Full-Stack & Web' },
    { id: 'backend', label: 'Databases & Storage' },
    { id: 'leadership', label: 'Strategy & Leadership' },
  ];

  return (
    <section id="skills" className="py-20 bg-slate-100/40 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Technical & Leadership Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Skills & Expertise Matrix
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Categorized breakdown of technical competencies, tools, and strategic proficiencies with verified recency and high-leverage application.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search keyword (e.g. AWS, SQS, Claude)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id as any)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0b0f17] p-6 sm:p-7 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-950/20 hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Category & Recency */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    {skill.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {skill.recency}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {skill.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                  {skill.summary}
                </p>
              </div>

              {/* Keyword Badges */}
              <div>
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Keywords & Tools
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-2 py-0.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-indigo-500/50 transition"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No matching competencies found for "{searchQuery}". Try a different search term.
          </div>
        )}
      </div>
    </section>
  );
}
