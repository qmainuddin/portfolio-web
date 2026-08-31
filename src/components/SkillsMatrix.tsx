import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface SkillItem {
  id: string;
  category: 'ai' | 'backend' | 'fullstack' | 'cloud' | 'leadership';
  title: string;
  recency: string;
  summary: string;
  keywords: string[];
}

const skillsData: SkillItem[] = [
  {
    id: 'ai-agents',
    category: 'ai',
    title: 'AI Agents, LLMs & Agentic Coding',
    recency: 'Active Production (2024–2026)',
    summary:
      'Claude and Claude Code, Cursor, Codex used for agentic coding, tool use, and automated workflows; LLM integration, agent architectures, prompting strategies, RAG, benchmarking, and evaluation for real SME operations.',
    keywords: ['Claude Code', 'Cursor', 'Codex', 'Agent Architectures', 'Tool Calling', 'RAG', 'Prompt Strategies', 'LLM Benchmarking'],
  },
  {
    id: 'backend-java-python',
    category: 'backend',
    title: 'Backend Engineering (Java → Python)',
    recency: '9 Years Core Production',
    summary:
      'Nine years in Java and Spring Boot — REST APIs, microservices, OOP and design patterns, SQL (PostgreSQL, Oracle) and NoSQL — with the exact same distributed-systems fundamentals now applied in Python for services, data pipelines, ML, and automation. Java experience transfers to Python directly.',
    keywords: ['Java 11/17/21', 'Spring Boot', 'Python', 'Microservices', 'REST APIs', 'Redis Caching', 'PostgreSQL / Oracle', 'Kafka', 'Distributed Systems'],
  },
  {
    id: 'fullstack-web',
    category: 'fullstack',
    title: 'Full-Stack Web & Mobile Ecosystems',
    recency: '9 Years Production',
    summary:
      'TypeScript/JavaScript, Next.js, React, React Native (shipped iOS & Android apps to App Store/Play Store), Node.js, Astro, REST API design, Supabase, PostgreSQL, and Vercel deployment with accessible functional component design.',
    keywords: ['TypeScript', 'Next.js', 'React', 'React Native (iOS/Android)', 'Astro', 'Node.js', 'REST APIs', 'Supabase / Postgres'],
  },
  {
    id: 'python-data-ml',
    category: 'backend',
    title: 'Python, Data Pipelines & Applied ML',
    recency: 'Master of AI (Level 9)',
    summary:
      'Python for autonomous agent services, ETL data pipelines, machine learning, and deep learning. NumPy, Pandas, PyTorch workflows, and Spark/Hadoop processing over multi-terabyte datasets, backed by deep CS and enterprise architecture foundations.',
    keywords: ['Python', 'NumPy / Pandas', 'PyTorch', 'SparkSQL', 'Hadoop', 'Data Pipelines', 'Meta-Learning ML', 'Deep Learning'],
  },
  {
    id: 'cloud-devops',
    category: 'cloud',
    title: 'Cloud Infrastructure, AWS & CI/CD',
    recency: '9 Years Production',
    summary:
      'AWS (Lambda, DynamoDB, S3, NoSQL), Docker containerization, Redis caching layers (cutting read latency >80%), GitHub Actions CI/CD pipelines, Caddy reverse proxy, and operational telemetry dashboards.',
    keywords: ['AWS (Lambda, S3, DynamoDB)', 'Docker', 'Redis Caching', 'CI/CD Pipelines', 'GitHub Actions', 'Caddy Reverse Proxy', 'Kafka', 'TDD / Vitest'],
  },
  {
    id: 'ways-of-working',
    category: 'leadership',
    title: 'Ways of Working & Client Collaboration',
    recency: 'Continuous Practice',
    summary:
      'Self-directed, end-to-end ownership of features from whiteboard to deployment. Cross-functional leadership, client-facing communication, technical trade-off analysis, and clear written and verbal collaboration.',
    keywords: ['End-to-End Ownership', 'Client-Facing Delivery', 'Technical Leadership', 'Trade-Off Analysis', 'Agile / Jira', 'Code Reviews'],
  },
];

export default function SkillsMatrix() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'backend' | 'fullstack' | 'cloud' | 'leadership'>('all');
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
    { id: 'ai', label: 'AI Agents & LLMs' },
    { id: 'backend', label: 'Backend (Java → Python)' },
    { id: 'fullstack', label: 'Full-Stack Web & Mobile' },
    { id: 'cloud', label: 'Cloud & Delivery' },
    { id: 'leadership', label: 'Ways of Working' },
  ];

  return (
    <section id="skills" className="py-20 bg-[#eef4f0]/60 dark:bg-[#0c1812]/50 border-b border-[#3b5446]/15 dark:border-[#52b788]/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d6a4f] dark:text-[#52b788]">
              Verified Technical Core
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12221a] dark:text-white tracking-tight mt-1">
              Skills & Engineering Matrix
            </h2>
            <p className="text-sm text-[#3b5446] dark:text-[#a3c4b2] mt-2 max-w-2xl">
              Categorized breakdown of technical competencies, tools, and methodologies with verified production recency and quantifiable impact.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#60796d] dark:text-[#8aa596] pointer-events-none" />
            <input
              type="text"
              placeholder="Search (e.g. Claude, Python, Redis)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#3b5446]/20 dark:border-[#52b788]/30 bg-white dark:bg-[#102018] py-2 pl-10 pr-4 text-xs text-[#12221a] dark:text-white placeholder-[#60796d] dark:placeholder-[#6c8a79] outline-none focus:border-[#52b788] focus:ring-1 focus:ring-[#52b788] transition shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id as any)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition duration-200 ${
                activeFilter === cat.id
                  ? 'bg-[#1e382b] text-white dark:bg-[#2d6a4f] dark:text-white shadow-sm'
                  : 'border border-[#3b5446]/20 dark:border-[#52b788]/20 bg-white/80 dark:bg-[#102018]/80 text-[#3b5446] dark:text-[#a3c4b2] hover:text-[#12221a] dark:hover:text-white hover:bg-[#e6eee8] dark:hover:bg-[#162a20]'
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
              className="rounded-3xl border border-[#3b5446]/15 dark:border-[#52b788]/20 bg-white/90 dark:bg-[#0e1d16]/90 p-6 sm:p-7 shadow-sm hover:shadow-lg dark:hover:shadow-[#2d6a4f]/15 hover:border-[#52b788]/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Category & Recency */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#2d6a4f] dark:text-[#95d5b2] bg-[#2d6a4f]/10 dark:bg-[#52b788]/15 px-3 py-1 rounded-full">
                    {skill.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-[#2d6a4f] dark:text-[#52b788] flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#52b788] animate-pulse" />
                    {skill.recency}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#12221a] dark:text-white mb-2 tracking-tight">
                  {skill.title}
                </h3>
                <p className="text-xs text-[#3b5446] dark:text-[#c3d9cc] leading-relaxed mb-5">
                  {skill.summary}
                </p>
              </div>

              {/* Keyword Badges */}
              <div>
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#60796d] dark:text-[#8aa596] mb-2">
                  Keywords & Tools
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[#3b5446]/15 dark:border-[#52b788]/20 bg-[#f4f8f5] dark:bg-[#12241b] px-2.5 py-0.5 text-[11px] font-mono text-[#2d4d3c] dark:text-[#c3d9cc] hover:border-[#52b788]/50 transition"
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
          <div className="text-center py-12 text-[#60796d] text-sm">
            No matching competencies found for "{searchQuery}". Try a different search term.
          </div>
        )}
      </div>
    </section>
  );
}
