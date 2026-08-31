import React, { useState, useEffect } from 'react';
import { Mail, Phone, HelpCircle, CheckCircle2, AlertCircle, Loader2, X, Download, ShieldCheck, User } from 'lucide-react';

interface ResumeModalProps {
  isOpenDefault?: boolean;
}

export default function ResumeModal({ isOpenDefault = false }: ResumeModalProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [intent, setIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resultData, setResultData] = useState<{
    requestId?: string;
    category?: string;
    downloadUrl?: string;
    emailDelivered?: boolean;
  } | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setError(null);
      setFieldErrors({});
    };

    window.addEventListener('open-resume-modal', handleOpen);
    return () => window.removeEventListener('open-resume-modal', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
    setTimeout(() => {
      if (resultData) {
        setName('');
        setEmail('');
        setPhone('');
        setIntent('');
        setResultData(null);
      }
      setError(null);
      setFieldErrors({});
    }, 200);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Please provide your name.';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (phone.trim() && !/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,15}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number or leave blank.';
    }

    if (!intent.trim()) {
      errs.intent = 'Please specify why you are requesting my resume.';
    } else if (intent.trim().length < 5) {
      errs.intent = 'Please provide at least a brief context (minimum 5 characters).';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/request-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          intent: intent.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to submit request. Please try again.');
        if (data.details && Array.isArray(data.details)) {
          const detailErrors: Record<string, string> = {};
          data.details.forEach((d: { field: string; message: string }) => {
            detailErrors[d.field] = d.message;
          });
          setFieldErrors(detailErrors);
        }
      } else {
        setResultData(data.data || { downloadUrl: '/assets/Mainuddin_Talukdar_Resume.pdf' });
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#3b5446]/25 dark:border-[#52b788]/30 bg-white dark:bg-[#0e1c15] text-[#12221a] dark:text-[#f0f7f3] shadow-2xl transition-all animate-slide-up z-10">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e382b] via-[#52b788] to-[#95d5b2]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-[#60796d] dark:text-[#a3c4b2] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {!resultData ? (
            <>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] dark:text-[#95d5b2] border border-[#2d6a4f]/20">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 id="modal-title" className="text-xl font-bold text-[#12221a] dark:text-white tracking-tight">
                  Request Official Resume
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#60796d] dark:text-[#a3c4b2] mb-6">
                To prevent web scrapers and prioritize genuine inquiries, please provide your details.
                The official PDF resume will be sent directly to your inbox.
              </p>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="gate-name" className="block text-xs font-bold uppercase tracking-wider text-[#3b5446] dark:text-[#c3d9cc] mb-1.5">
                    Your Full Name <span className="text-[#2d6a4f] dark:text-[#52b788]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-[#60796d] dark:text-[#8aa596] pointer-events-none" />
                    <input
                      id="gate-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Thompson / Sarah Connor"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`w-full rounded-xl border bg-[#f4f8f5] dark:bg-[#12241b] py-2.5 pl-10 pr-3 text-sm text-[#12221a] dark:text-white placeholder-[#60796d] dark:placeholder-[#6c8a79] outline-none transition focus:ring-2 focus:ring-[#52b788] ${
                        fieldErrors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#3b5446]/20 dark:border-[#52b788]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-rose-500">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="gate-email" className="block text-xs font-bold uppercase tracking-wider text-[#3b5446] dark:text-[#c3d9cc] mb-1.5">
                    Your Email Address <span className="text-[#2d6a4f] dark:text-[#52b788]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#60796d] dark:text-[#8aa596] pointer-events-none" />
                    <input
                      id="gate-email"
                      type="email"
                      required
                      placeholder="e.g. alex@company.co.nz"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full rounded-xl border bg-[#f4f8f5] dark:bg-[#12241b] py-2.5 pl-10 pr-3 text-sm text-[#12221a] dark:text-white placeholder-[#60796d] dark:placeholder-[#6c8a79] outline-none transition focus:ring-2 focus:ring-[#52b788] ${
                        fieldErrors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#3b5446]/20 dark:border-[#52b788]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-rose-500">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="gate-phone" className="block text-xs font-bold uppercase tracking-wider text-[#3b5446] dark:text-[#c3d9cc]">
                      Phone Number
                    </label>
                    <span className="text-[11px] text-[#60796d] dark:text-[#8aa596]">Optional</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#60796d] dark:text-[#8aa596] pointer-events-none" />
                    <input
                      id="gate-phone"
                      type="tel"
                      placeholder="e.g. +64 22 000 0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className={`w-full rounded-xl border bg-[#f4f8f5] dark:bg-[#12241b] py-2.5 pl-10 pr-3 text-sm text-[#12221a] dark:text-white placeholder-[#60796d] dark:placeholder-[#6c8a79] outline-none transition focus:ring-2 focus:ring-[#52b788] ${
                        fieldErrors.phone ? 'border-rose-500' : 'border-[#3b5446]/20 dark:border-[#52b788]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-rose-500">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Intent Reason Field */}
                <div>
                  <label htmlFor="gate-intent" className="block text-xs font-bold uppercase tracking-wider text-[#3b5446] dark:text-[#c3d9cc] mb-1.5">
                    Context / Purpose of Inquiry <span className="text-[#2d6a4f] dark:text-[#52b788]">*</span>
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-3.5 top-3 w-4 h-4 text-[#60796d] dark:text-[#8aa596] pointer-events-none" />
                    <textarea
                      id="gate-intent"
                      required
                      rows={3}
                      placeholder="e.g. Inquiring about full-time AI Engineer role in Christchurch, internship R&D, or architectural consulting..."
                      value={intent}
                      onChange={e => setIntent(e.target.value)}
                      className={`w-full rounded-xl border bg-[#f4f8f5] dark:bg-[#12241b] py-2.5 pl-10 pr-3 text-sm text-[#12221a] dark:text-white placeholder-[#60796d] dark:placeholder-[#6c8a79] outline-none transition focus:ring-2 focus:ring-[#52b788] ${
                        fieldErrors.intent ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#3b5446]/20 dark:border-[#52b788]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.intent && (
                    <p className="mt-1 text-xs text-rose-500">{fieldErrors.intent}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1e382b] hover:bg-[#284a39] dark:bg-[#2d6a4f] dark:hover:bg-[#388261] px-4 py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Official Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success View */
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#52b788]/15 text-[#2d6a4f] dark:text-[#95d5b2] border border-[#52b788]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-[#12221a] dark:text-white mb-2">Resume Dispatched!</h3>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d6a4f]/10 dark:bg-[#52b788]/15 border border-[#52b788]/30 text-xs font-mono text-[#2d6a4f] dark:text-[#95d5b2] mb-4 font-semibold">
                <span>Inquiry Tagged:</span>
                <strong>{resultData.category || 'Verified Inquiry'}</strong>
              </div>

              <p className="text-sm text-[#3b5446] dark:text-[#c3d9cc] mb-6 leading-relaxed">
                A copy of my official resume has been dispatched to <strong className="text-[#12221a] dark:text-white">{email}</strong>.
                You can also download a direct copy immediately below.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={resultData.downloadUrl || '/assets/Mainuddin_Talukdar_Resume.pdf'}
                  download="Mainuddin-Talukdar-Resume.pdf"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#2d6a4f] hover:bg-[#388261] px-4 py-2.5 text-sm font-bold text-white transition shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Now</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-[#3b5446]/20 dark:border-[#52b788]/30 bg-[#f4f8f5] dark:bg-[#12241b] hover:bg-[#e6eee8] dark:hover:bg-[#162a20] px-4 py-2.5 text-sm font-semibold text-[#12221a] dark:text-white transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
