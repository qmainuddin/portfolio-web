import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Download,
  ShieldCheck,
  RefreshCw,
  Users,
  Search,
  ExternalLink,
  ArrowLeft,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';

interface ResumeStats {
  exists: boolean;
  filename: string;
  sizeBytes: number;
  sizeFormatted: string;
  lastModified: string;
}

interface LeadRecord {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  intent_raw: string;
  intent_category: string;
  intent_score: number;
  intent_summary?: string;
  status: string;
  created_at: string;
}

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>('qmain');
  const [activeTab, setActiveTab] = useState<'resume' | 'leads'>('resume');

  // Login Form States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Resume Upload States
  const [resumeStats, setResumeStats] = useState<ResumeStats | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Leads States
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState<string>('all');
  const [leadsSearch, setLeadsSearch] = useState<string>('');

  // Check initial session
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUsername(data.user?.username || 'qmain');
          setResumeStats(data.resume);
          fetchLeads();
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUser.trim(),
          password: loginPass.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Invalid credentials. Please try again.');
        setLoginLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setAdminUsername(data.user?.username || loginUser);
      setLoginUser('');
      setLoginPass('');
      checkSession();
    } catch (err: any) {
      setLoginError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
      setSelectedFile(null);
      setUploadSuccess(null);
      setUploadError(null);
    }
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      }
    } catch (err) {
      console.warn('Could not fetch leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('Invalid file type. Please upload a PDF (.pdf) document.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File exceeds maximum limit of 20MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/admin/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setUploadError(data.error || 'Failed to upload resume.');
      } else {
        setUploadSuccess(
          `Resume updated successfully! (${data.data?.sizeFormatted || `${(selectedFile.size / 1024).toFixed(1)} KB`})`
        );
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        checkSession();
      }
    } catch (err: any) {
      setUploadError(err.message || 'Network error during upload.');
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesCategory =
      leadsFilter === 'all' || lead.intent_category?.toLowerCase() === leadsFilter.toLowerCase();
    const query = leadsSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (lead.name && lead.name.toLowerCase().includes(query)) ||
      lead.email?.toLowerCase().includes(query) ||
      (lead.phone && lead.phone.toLowerCase().includes(query)) ||
      lead.intent_raw?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Initial Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm font-mono">Initializing secure admin session...</p>
      </div>
    );
  }

  // Login Card View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-[#0e1d16] text-slate-100 p-8 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Admin Console</h2>
              <p className="text-xs text-slate-400">Sign in to manage resume & platform leads</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. qmain"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <a href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Portal View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authenticated as <strong className="text-emerald-400 font-mono">@{adminUsername}</strong> &bull; Resume management & inbound leads
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'resume'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume Publisher & Upload</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('leads');
            fetchLeads();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'leads'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Inbound Leads & Submissions ({leads.length})</span>
        </button>
      </div>

      {/* Tab 1: Resume Upload & Management */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0e1d16] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Upload & Replace Resume</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a new PDF to immediately update the live resume distributed to website visitors and transactional emails.
                </p>
              </div>

              {uploadError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/20'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <UploadCloud className="w-6 h-6" />
                </span>

                <div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-400">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready to publish
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-200">
                        Click or drag new PDF resume here
                      </p>
                      <p className="text-xs text-slate-400">
                        Supports PDF files up to 20MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Clear selection
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleUploadResume}
                  disabled={!selectedFile || uploadLoading}
                  className="ml-auto inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Replacing Live Resume...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Publish & Replace Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Current Active Resume Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0e1d16] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active Live Resume
                </h3>
                <button
                  onClick={checkSession}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Refresh status"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">
                      {resumeStats?.filename || 'Mainuddin_Talukdar_Resume.pdf'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      File Size: {resumeStats?.sizeFormatted || 'Loading...'}
                    </p>
                  </div>
                </div>

                {resumeStats?.lastModified && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Last Updated: {new Date(resumeStats.lastModified).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="/assets/Mainuddin_Talukdar_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Preview Active PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leads & Inquiries */}
      {activeTab === 'leads' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0e1d16] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Inbound Resume Inquiries</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified leads captured through the public resume gate
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={leadsFilter}
                onChange={e => setLeadsFilter(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                <option value="recruiter">Recruiters</option>
                <option value="client">Clients / Consulting</option>
                <option value="engineering peer">Engineering Peers</option>
                <option value="spam">Spam / Flagged</option>
              </select>

              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name, email, intent..."
                  value={leadsSearch}
                  onChange={e => setLeadsSearch(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 w-48 sm:w-64"
                />
              </div>

              <button
                onClick={fetchLeads}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Refresh leads"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${leadsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Leads Table */}
          {leadsLoading && leads.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-mono">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
              Loading inquiries...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No inquiries found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Contact</th>
                    <th className="pb-3 px-3">Intent Reason</th>
                    <th className="pb-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                            lead.intent_category === 'Recruiter'
                              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                              : lead.intent_category === 'Client'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : lead.intent_category === 'Engineering Peer'
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              : 'bg-red-500/15 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {lead.intent_category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <div className="font-bold text-white">{lead.name || 'Anonymous'}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <a href={`mailto:${lead.email}`} className="hover:text-emerald-400">
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 align-top max-w-md">
                        <p className="text-slate-300 text-xs leading-relaxed">{lead.intent_raw}</p>
                        {lead.intent_summary && (
                          <p className="text-[11px] text-slate-500 italic mt-1 font-mono">
                            AI: {lead.intent_summary}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-3 align-top whitespace-nowrap text-slate-400 text-[11px] font-mono">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
