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
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-1"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1e382b] to-[#2d6a4f] dark:from-[#2d6a4f] dark:to-[#52b788] text-[#f4f7f4] font-mono font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            MT
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[#12221a] dark:text-[#f0f7f3] group-hover:text-[#2d6a4f] dark:group-hover:text-[#52b788] transition-colors">
              Mainuddin Talukdar
            </span>
            <span className="text-[10px] font-mono text-[#2d6a4f] dark:text-[#95d5b2] flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#52b788] animate-pulse" />
              AI Engineer &bull; Christchurch
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-[#1e382b] text-[#f4f7f4] dark:bg-[#2d6a4f] dark:text-white shadow-sm'
                  : 'text-[#3b5446] dark:text-[#a3c4b2] hover:text-[#12221a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
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
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[#3b5446] dark:text-[#a3c4b2] hover:text-[#12221a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              aria-expanded={isAppsOpen}
            >
              <span>Apps</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAppsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAppsOpen && (
              <div
                onMouseLeave={() => setIsAppsOpen(false)}
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#3b5446]/20 dark:border-[#52b788]/20 bg-white/95 dark:bg-[#0e1c15]/95 p-2.5 shadow-2xl backdrop-blur-xl animate-fade-in z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#60796d] dark:text-[#6c8a79] border-b border-black/5 dark:border-white/5 mb-1.5">
                  AI & Web Applications
                </div>
                
                <button
                  onClick={() => openAppsModal('tradiepulse')}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-[#e6eee8] dark:hover:bg-[#162a20] transition group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f] dark:text-[#95d5b2] group-hover:bg-[#2d6a4f]/20">
                    <Smartphone className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#12221a] dark:text-white group-hover:text-[#2d6a4f] dark:group-hover:text-[#95d5b2]">TradiePulse</div>
                    <div className="text-[11px] text-[#60796d] dark:text-[#a3c4b2] line-clamp-1">Conversational AI trade matching</div>
                  </div>
                </button>

                <button
                  onClick={() => openAppsModal('mathquest')}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-[#e6eee8] dark:hover:bg-[#162a20] transition group"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#52b788]/10 text-[#52b788] group-hover:bg-[#52b788]/20">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#12221a] dark:text-white group-hover:text-[#52b788]">MathQuest</div>
                    <div className="text-[11px] text-[#60796d] dark:text-[#a3c4b2] line-clamp-1">Adaptive gamified maths learning</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Blog Link */}
          <a
            href="https://blog.mainuddintalukdar.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[#3b5446] dark:text-[#a3c4b2] hover:text-[#12221a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <span>Blog</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </nav>

        {/* Right Action Group */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3b5446]/20 dark:border-[#52b788]/30 bg-white/70 dark:bg-[#13241c] text-[#12221a] dark:text-[#f0f7f3] hover:scale-105 active:scale-95 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#facc15]" /> : <Moon className="w-4 h-4 text-[#2d6a4f]" />}
          </button>

          {/* Request Resume CTA (TMRo pill button style) */}
          <button
            onClick={openResumeModal}
            className="inline-flex items-center gap-2 rounded-full bg-[#1e382b] hover:bg-[#284a39] dark:bg-[#2d6a4f] dark:hover:bg-[#388261] px-4 py-2 text-xs font-bold text-[#f4f7f4] shadow-sm transition hover:-translate-y-0.5 active:translate-y-0"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3b5446]/20 dark:border-[#52b788]/30 bg-white/80 dark:bg-[#13241c] text-[#12221a] dark:text-[#f0f7f3]"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#facc15]" /> : <Moon className="w-4 h-4 text-[#2d6a4f]" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3b5446]/20 dark:border-[#52b788]/30 bg-white/80 dark:bg-[#13241c] text-[#12221a] dark:text-[#f0f7f3]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#3b5446]/20 dark:border-[#52b788]/20 bg-white/95 dark:bg-[#09130e]/95 px-4 pt-3 pb-6 space-y-3 animate-fade-in backdrop-blur-xl">
          <div className="space-y-1">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#3b5446] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] hover:text-[#12221a] dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="border-t border-black/5 dark:border-white/5 pt-3 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#60796d] dark:text-[#6c8a79] px-3">
              Apps & Blog
            </div>
            <button
              onClick={() => openAppsModal('tradiepulse')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-[#3b5446] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] flex items-center justify-between"
            >
              <span>TradiePulse</span>
              <Smartphone className="w-4 h-4 text-[#2d6a4f] dark:text-[#95d5b2]" />
            </button>
            <button
              onClick={() => openAppsModal('mathquest')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-[#3b5446] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] flex items-center justify-between"
            >
              <span>MathQuest</span>
              <Sparkles className="w-4 h-4 text-[#52b788]" />
            </button>
            <a
              href="https://blog.mainuddintalukdar.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-xl text-sm text-[#3b5446] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] flex items-center justify-between"
            >
              <span>Engineering Blog</span>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={openResumeModal}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1e382b] dark:bg-[#2d6a4f] hover:bg-[#284a39] dark:hover:bg-[#388261] py-3 text-sm font-bold text-white shadow-md"
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
