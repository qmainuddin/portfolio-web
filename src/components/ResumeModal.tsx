import React, { useState, useEffect } from 'react';
import { Mail, Phone, HelpCircle, CheckCircle2, AlertCircle, Loader2, X, Download, ShieldCheck } from 'lucide-react';

interface ResumeModalProps {
  isOpenDefault?: boolean;
}

export default function ResumeModal({ isOpenDefault = false }: ResumeModalProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
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
    // Reset form after close animation
    setTimeout(() => {
      if (resultData) {
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
        setResultData(data.data || { downloadUrl: '/assets/resume-sample.pdf' });
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
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0b0f17] dark:bg-[#0b0f17] text-slate-100 shadow-2xl shadow-indigo-950/40 transition-all animate-slide-up z-10">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {!resultData ? (
            <>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 id="modal-title" className="text-xl font-bold text-white tracking-tight">
                  Request Official Resume
                </h3>
              </div>

              <p className="text-sm text-slate-400 mb-6">
                To prevent web scrapers and prioritize human inquiries, please provide your contact details and context.
                The full PDF resume will be sent directly to your inbox.
              </p>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="gate-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Email Address <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="gate-email"
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full rounded-lg border bg-slate-900/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700/80'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="gate-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Phone Number
                    </label>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="gate-phone"
                      type="tel"
                      placeholder="e.g. +64 21 000 0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className={`w-full rounded-lg border bg-slate-900/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.phone ? 'border-red-500' : 'border-slate-700/80'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Intent Reason Field */}
                <div>
                  <label htmlFor="gate-intent" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Why are you requesting my resume? <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <textarea
                      id="gate-intent"
                      required
                      rows={3}
                      placeholder="e.g. Hiring for a Principal AI / Full-Stack Engineer role, or inquiring about architectural consulting..."
                      value={intent}
                      onChange={e => setIntent(e.target.value)}
                      className={`w-full rounded-lg border bg-slate-900/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.intent ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700/80'
                      }`}
                    />
                  </div>
                  {fieldErrors.intent && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.intent}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Me The Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success View */
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Resume Dispatched!</h3>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 mb-4">
                <span>Inquiry Tagged:</span>
                <strong className="text-indigo-200">{resultData.category || 'Verified Inquiry'}</strong>
              </div>

              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                A copy of my official resume has been dispatched to <strong className="text-white">{email}</strong>.
                You can also download a direct copy immediately using the button below.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={resultData.downloadUrl || '/assets/resume-sample.pdf'}
                  download="Mainuddin-Talukdar-Resume.pdf"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition shadow-lg shadow-emerald-950/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Now</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition"
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
