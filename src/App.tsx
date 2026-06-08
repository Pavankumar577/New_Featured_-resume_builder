import React, { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  saveResumeToCloud, 
  fetchUserResumes, 
  deleteResumeFromCloud 
} from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Resume, RecruiterFeedback, ATSAnalysis, DetoxAnalysis, ATSType } from './types';
import HalftoneWaveBackground from './components/HalftoneWaveBackground';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import RecruiterAudit from './components/RecruiterAudit';
import ATSPipeline from './components/ATSPipeline';
import DetoxFilter from './components/DetoxFilter';

import { 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Cpu, 
  User as UserIcon, 
  LogOut, 
  ChevronRight, 
  Plus, 
  FolderOpen, 
  Trash2, 
  Home, 
  ArrowLeft,
  Briefcase,
  Layers,
  HeartCrack,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const emptyResumeTemplate = (userId: string, displayName: string, email: string): Resume => ({
  id: crypto.randomUUID(),
  userId,
  title: 'My Engineering Resume',
  personalInfo: {
    name: displayName || '',
    email: email || '',
    phone: '+1 (555) 019-2834',
    website: 'https://johndoe.dev',
    location: 'San Francisco, CA',
    title: 'Senior Full Stack Architect',
    summary: 'Senior software engineering professional with over 6 years of experience building scalable visual solutions. Dedicated to clean web design philosophies, standard modular design architectures, and modern cloud deployment frameworks.'
  },
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Oracle Tech Systems',
      role: 'Staff Architect',
      location: 'Austin, TX',
      startDate: '2022-06-01',
      endDate: 'Present',
      current: true,
      description: 'Led a distributed development group to re-engineer microservices, optimizing sub-second response limits to achieve high system efficiency. Designed and engineered interactive analytics visual controllers.'
    },
    {
      id: crypto.randomUUID(),
      company: 'Sandbox Technologies',
      role: 'Frontend Associate',
      location: 'Seattle, WA',
      startDate: '2020-03-15',
      endDate: '2022-05-30',
      current: false,
      description: 'Participated in developing visual content and modular systems. Investigated and rectified application bottlenecks.'
    }
  ],
  education: [
    {
      id: crypto.randomUUID(),
      school: 'University of California',
      degree: 'B.S.',
      fieldOfStudy: 'Computer Engineering',
      location: 'Berkeley, CA',
      startDate: '2016-09-01',
      endDate: '2020-05-15',
      current: false,
      description: 'Graduated with high honors. Active participant in engineering development circles.'
    }
  ],
  skills: ['TypeScript', 'Node.js', 'React', 'Firebase', 'GraphQL', 'Tailwind CSS', 'Docker', 'System Architecture'],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'Dynamic Data Canvas',
      role: 'Creator & Lead',
      description: 'Engineered an interactive dashboard parsing complex cloud server metrics into stylized responsive layouts leveraging web layout optimizations.',
      url: 'https://github.com/example/dynamic-canvas'
    }
  ],
  atsType: 'workday'
});

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Audits state
  const [recruiterFeedback, setRecruiterFeedback] = useState<RecruiterFeedback | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // ATS analysis state
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAtsParsing, setIsAtsParsing] = useState(false);

  // Detox state
  const [detoxAnalysis, setDetoxAnalysis] = useState<DetoxAnalysis | null>(null);
  const [isDetoxScanning, setIsDetoxScanning] = useState(false);
  const [detoxInputText, setDetoxInputText] = useState('');
  const [isDetoxOptimizing, setIsDetoxOptimizing] = useState(false);

  // Sidebar controls
  const [sidebarTab, setSidebarTab] = useState<'audit' | 'ats' | 'detox'>('audit');
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsInitializing(false);
      if (u) {
        loadUserResumes(u.uid);
      } else {
        setResumes([]);
        setActiveResume(null);
        setRecruiterFeedback(null);
        setAtsAnalysis(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserResumes = async (uid: string) => {
    setIsLoadingList(true);
    try {
      const list = await fetchUserResumes(uid);
      setResumes(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Auth process interrupted:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateResume = async () => {
    if (!user) return;
    const newDoc = emptyResumeTemplate(user.uid, user.displayName || '', user.email || '');
    setIsSaving(true);
    try {
      await saveResumeToCloud(newDoc);
      setResumes((prev) => [newDoc, ...prev]);
      setActiveResume(newDoc);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveResume = async () => {
    if (!activeResume) return;
    setIsSaving(true);
    try {
      await saveResumeToCloud(activeResume);
      // reload lists
      if (user) {
        await loadUserResumes(user.uid);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await deleteResumeFromCloud(id);
      setResumes((prev) => prev.filter(r => r.id !== id));
      if (activeResume?.id === id) {
        setActiveResume(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run Multi-Agent Recruiter Critique
  const runRecruiterAudit = async () => {
    if (!activeResume) return;
    setIsAuditing(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: activeResume })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRecruiterFeedback(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Run Real-time ATS Compiler Parser
  const runATSParsing = async () => {
    if (!activeResume) return;
    setIsAtsParsing(true);
    try {
      const response = await fetch('/api/ats-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: activeResume, atsType: activeResume.atsType })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAtsAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAtsParsing(false);
    }
  };

  // Run Inline Content Detox Scan
  const runDetoxScanning = async () => {
    if (!detoxInputText) return;
    setIsDetoxScanning(true);
    try {
      const response = await fetch('/api/detox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: detoxInputText })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setDetoxAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetoxScanning(false);
    }
  };

  // AI optimizer inline callback
  const handleAIHumanizerOptimize = async (textToOptimize: string, onDone: (optText: string) => void) => {
    if (!textToOptimize) return;
    setIsDetoxOptimizing(true);
    try {
      const response = await fetch('/api/detox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToOptimize })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (data.humanizedAlternative) {
        onDone(data.humanizedAlternative);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetoxOptimizing(false);
    }
  };

  // Master Content scan triggers to auto-update detox report on field blur
  const autoDetoxScanOnBlur = (textSeen: string) => {
    if (!textSeen) return;
    setDetoxInputText(textSeen);
    // set timeout/trigger scanning
    setTimeout(() => {
      runDetoxScanning();
    }, 200);
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <HalftoneWaveBackground />
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-mono tracking-widest text-slate-400 uppercase">Synchronising Spectrum Node...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background System */}
      <HalftoneWaveBackground />

      {/* Main Header / Navigation bar */}
      <header className="no-print w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-20 border-b border-white/5 bg-slate-950/25 backdrop-blur-md rounded-b-xl">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-400" />
          <h1 className="text-base font-display font-medium tracking-wide text-white">
            ATS SPECTRE <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono py-0.5 px-1.5 rounded-md font-semibold ml-1 uppercase">Beta</span>
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-medium text-slate-200">{user.displayName}</span>
              <span className="text-[9px] font-mono text-slate-400">{user.email}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer border border-white/5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Primary Workspace Dynamic routing */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 z-10 flex flex-col justify-start">
        {!user ? (
          /* Landing page when unauthenticated */
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-2xl mx-auto">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/15 rounded-full text-indigo-300 text-xs font-mono font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Anti-AI ATS Defense Core
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white mb-4">
              Defeat the Automated ATS Filtering Pipeline.
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg mb-8 text-justify md:text-center">
              Write professional, high-impact resumes audited for vendor-specific parsing limits. Spot, detoxify, and humanize AI structural clichés in real-time, securing your place in the hiring process.
            </p>

            {/* Login Box */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-4 w-full max-w-sm">
              <h3 className="text-sm font-semibold font-display tracking-widest text-slate-300 uppercase">
                Initialize Secure Session
              </h3>
              <p className="text-xs text-slate-400">
                Register or log in via Google to database and persist resume drafts.
              </p>
              <button
                onClick={handleLogin}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition duration-200 transform active:scale-95 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Router Panel */
          <div className="flex-1 flex flex-col min-h-0">
            {!activeResume ? (
              /* User Dashboard View */
              <div className="space-y-6">
                {/* Header Welcome banner */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-2xl font-display font-medium text-white">My Resumes</h2>
                    <p className="text-xs text-slate-400 mt-1">Single-Source Cloud Database Sandbox</p>
                  </div>
                  
                  <button
                    onClick={handleCreateResume}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create New Resume
                  </button>
                </div>

                {isLoadingList ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-900/10 rounded-2xl border border-white/5">
                    <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs text-slate-400 font-mono">Syncing resumes list...</p>
                  </div>
                ) : resumes.length === 0 ? (
                  /* Zero Resumes */
                  <div className="text-center py-24 bg-slate-900/10 rounded-2xl border border-dashed border-white/5">
                    <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-base font-semibold text-slate-300">No Documents Compiled</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                      Initialize an empty draft template inside your private profile. Add experience, tech stack, and trigger simulated persona reviews.
                    </p>
                    <button
                      onClick={handleCreateResume}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer border border-white/5 transition"
                    >
                      Build Template Draft
                    </button>
                  </div>
                ) : (
                  /* Grid view of existing resumes */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => {
                          setActiveResume(res);
                          // reset feed/anal to prevent state carryover
                          setRecruiterFeedback(null);
                          setAtsAnalysis(null);
                        }}
                        className="group p-5 rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-indigo-500/20 shadow-xl transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden"
                      >
                        {/* Hover glow node */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 group-hover:bg-indigo-500/10 blur-2xl rounded-full transition-all" />

                        <div className="space-y-2 mb-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white font-display tracking-wide">{res.title}</h3>
                            <button
                              onClick={(e) => handleDeleteResume(res.id, e)}
                              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Target: {res.atsType}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {res.personalInfo.summary || 'No intro summary draft defined.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-slate-500 font-mono">
                          <span>Revision: {res.id.substring(0, 8).toUpperCase()}</span>
                          <span className="group-hover:text-indigo-400 transition-colors flex items-center gap-0.5">
                            Open Resume <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Split Screen Active Document Editor Space */
              <div className="flex-1 flex flex-col min-h-0 space-y-4">
                {/* Editor Control Header */}
                <div className="flex items-center justify-between no-print border-b border-white/5 pb-3">
                  <button
                    onClick={() => {
                      setActiveResume(null);
                      setRecruiterFeedback(null);
                      setAtsAnalysis(null);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Resumes</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono uppercase">Node Synchronization Online</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>

                {/* Split workspace */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                  {/* Left Column: Form Editor (lg:col-span-4) */}
                  <div className="lg:col-span-4 min-h-0 h-full flex flex-col no-print">
                    <ResumeForm 
                      resume={activeResume} 
                      onChange={setActiveResume} 
                      onSave={handleSaveResume}
                      isSaving={isSaving}
                      onOptimize={handleAIHumanizerOptimize}
                      isOptimizing={isDetoxOptimizing}
                      onDetoxAll={autoDetoxScanOnBlur}
                    />
                  </div>

                  {/* Middle Column: Live Paper Document (lg:col-span-5) */}
                  <div className="lg:col-span-5 min-h-0 h-full flex flex-col">
                    <ResumePreview 
                      resume={activeResume} 
                      showHeatmap={showHeatmap}
                      onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
                    />
                  </div>

                  {/* Right Column: AI suite (lg:col-span-3) */}
                  <div className="lg:col-span-3 min-h-0 h-full flex flex-col bg-slate-900/45 backdrop-blur-md border border-white/5 rounded-2xl p-5 overflow-hidden no-print">
                    {/* Tab Navigation header */}
                    <div className="flex border-b border-white/5 mb-4 p-0.5 bg-slate-950/20 rounded-lg">
                      <button
                        onClick={() => setSidebarTab('audit')}
                        className={`flex-1 py-1.5 px-1 rounded-md text-[10px] font-bold font-display uppercase tracking-widest text-center transition cursor-pointer ${
                          sidebarTab === 'audit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Audit
                      </button>
                      <button
                        onClick={() => setSidebarTab('ats')}
                        className={`flex-1 py-1.5 px-1 rounded-md text-[10px] font-bold font-display uppercase tracking-widest text-center transition cursor-pointer ${
                          sidebarTab === 'ats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ATS Sim
                      </button>
                      <button
                        onClick={() => setSidebarTab('detox')}
                        className={`flex-1 py-1.5 px-1 rounded-md text-[10px] font-bold font-display uppercase tracking-widest text-center transition cursor-pointer ${
                          sidebarTab === 'detox' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Detox
                      </button>
                    </div>

                    {/* Active Sidebar workspace */}
                    <div className="flex-1 overflow-y-auto pr-1">
                      {sidebarTab === 'audit' && (
                        <RecruiterAudit 
                          resume={activeResume}
                          feedback={recruiterFeedback}
                          onRunAudit={runRecruiterAudit}
                          isLoading={isAuditing}
                        />
                      )}
                      {sidebarTab === 'ats' && (
                        <ATSPipeline 
                          resume={activeResume}
                          analysis={atsAnalysis}
                          onRunAnalysis={runATSParsing}
                          isLoading={isAtsParsing}
                        />
                      )}
                      {sidebarTab === 'detox' && (
                        <DetoxFilter 
                          analysis={detoxAnalysis}
                          onOptimizeField={() => handleAIHumanizerOptimize(detoxInputText, (res) => {
                            setDetoxInputText(res);
                            setDetoxAnalysis((prev) => prev ? { ...prev, humanizedAlternative: res, aiLikelihoodScore: Math.max(10, prev.aiLikelihoodScore - 55) } : null);
                          })}
                          isOptimizing={isDetoxOptimizing}
                          inputText={detoxInputText}
                          onTextChange={setDetoxInputText}
                          onClearInput={() => {
                            setDetoxInputText('');
                            setDetoxAnalysis(null);
                          }}
                          onScanText={runDetoxScanning}
                          isScanning={isDetoxScanning}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer copyright section */}
      <footer className="no-print w-full max-w-7xl mx-auto px-6 py-6 mt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>Copyright &copy; 2026 ATS SPECTRE Technologies Group. All rights reserved.</p>
        <div className="flex gap-4 font-mono">
          <span>Server node: Running inside Cloud Run Container Target: 3000</span>
          <span>Durable Cloud Database: Firestore Cloud</span>
        </div>
      </footer>
    </div>
  );
}
