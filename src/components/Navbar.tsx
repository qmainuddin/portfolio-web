import { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  FileText,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const appsDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme on mount
  useEffect(() => {
    const isDarkMode =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close apps dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appsDropdownRef.current && !appsDropdownRef.current.contains(event.target as Node)) {
        setIsAppsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active section scroll observer
  useEffect(() => {
    const sections = ['hero', 'about', 'values', 'skills', 'experience', 'projects'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const openResumeModal = () => {
    window.dispatchEvent(new CustomEvent('open-resume-modal'));
    setIsMobileMenuOpen(false);
  };

  const openAppsModal = (app: 'tradiepulse' | 'mathquest') => {
    window.dispatchEvent(new CustomEvent('open-apps-modal', { detail: { app } }));
    setIsAppsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Values', href: '#values', id: 'values' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white font-mono font-bold shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            MT
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white dark:text-white group-hover:text-indigo-400 transition-colors">
              Mainuddin Talukdar
            </span>
            <span className="text-[10px] font-mono text-indigo-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Architect & Engineer
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeSection === link.id
                  ? 'text-indigo-400 bg-indigo-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Apps Dropdown */}
          <div className="relative" ref={appsDropdownRef}>
            <button
              onClick={() => setIsAppsOpen(!isAppsOpen)}
              onMouseEnter={() => setIsAppsOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/40 transition"
              aria-expanded={isAppsOpen}
            >
              <span>Apps</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAppsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAppsOpen && (
              <div
                onMouseLeave={() => setIsAppsOpen(false)}
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700/80 bg-[#0b0f17] p-2 shadow-xl shadow-black/60 animate-fade-in z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Ecosystem Products
                </div>
                
                <button
                  onClick={() => openAppsModal('tradiepulse')}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left hover:bg-slate-800/70 transition group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                    <Smartphone className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300">TradiePulse</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">Trade operations & dispatching</div>
                  </div>
                </button>

                <button
                  onClick={() => openAppsModal('mathquest')}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left hover:bg-slate-800/70 transition group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300">MathQuest</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">Adaptive gamified math learning</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Blog Button */}
          <a
            href="https://blog.mainuddintalukdar.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/40 transition"
          >
            <span>Blog</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </nav>

        {/* Right Action Group */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Request Resume CTA */}
          <button
            onClick={openResumeModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:scale-105 active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Request Resume</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-300"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0b0f17] px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="space-y-1">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3">
              Apps & Blog
            </div>
            <button
              onClick={() => openAppsModal('tradiepulse')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>TradiePulse</span>
              <Smartphone className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              onClick={() => openAppsModal('mathquest')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>MathQuest</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </button>
            <a
              href="https://blog.mainuddintalukdar.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Engineering Blog</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={openResumeModal}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              <FileText className="w-4 h-4" />
              <span>Request Official Resume</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
