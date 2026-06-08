import { useState } from 'react';
import { Resume, RecruiterFeedback } from '../types';
import { Play, ShieldAlert, CheckCircle2, AlertTriangle, Hammer, Users, HelpCircle } from 'lucide-react';

interface RecruiterAuditProps {
  resume: Resume;
  feedback: RecruiterFeedback | null;
  onRunAudit: () => void;
  isLoading: boolean;
}

export default function RecruiterAudit({ resume, feedback, onRunAudit, isLoading }: RecruiterAuditProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 70) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 70) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Run Audit Action Banner */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/15 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest font-display mb-1">
            Persona Scan Command
          </h4>
          <p className="text-[11px] text-slate-300">
            Submit document context to of three simulation agents.
          </p>
        </div>
        <button
          onClick={onRunAudit}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-lg shadow-indigo-600/10"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analysing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Command Audit</span>
            </>
          )}
        </button>
      </div>

      {!feedback ? (
        <div className="text-center py-8 border border-dashed border-white/5 rounded-xl bg-slate-950/10">
          <Users className="w-8 h-8 text-indigo-400/40 mx-auto mb-3" />
          <h5 className="text-xs font-semibold text-slate-300">Auditing Chamber Offline</h5>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1">
            Click &apos;Command Audit&apos; above to compile simulation opinions on your resume variables.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Persona #1: Tech Lead */}
          <div className="p-5 rounded-xl bg-slate-950/40 border border-white/5 space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-widest font-display">
                    Persona:
                  </span>
                  <span className="text-sm font-semibold text-white font-display">The Skeptical Tech Lead</span>
                </div>
                <p className="text-[10px] text-indigo-300 font-mono">Focused on: Tech Stack, Metrics, fluff-spotting</p>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold font-mono ${getScoreColor(feedback.techLead.score)}`}>
                {feedback.techLead.score}/100
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-lg text-xs text-slate-300 border-l-2 border-slate-500 leading-relaxed text-justify">
              &ldquo;{feedback.techLead.critique}&rdquo;
            </div>

            {feedback.techLead.suggestions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Hammer className="w-3.5 h-3.5 text-indigo-400" /> Hard technical remedies:
                </h5>
                <ul className="space-y-1.5">
                  {feedback.techLead.suggestions.map((sug, i) => (
                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Persona #2: HR Manager */}
          <div className="p-5 rounded-xl bg-slate-950/40 border border-white/5 space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-widest font-display">
                    Persona:
                  </span>
                  <span className="text-sm font-semibold text-white font-display">The HR Manager</span>
                </div>
                <p className="text-[10px] text-emerald-300 font-mono">Focused on: Role Alignment, Tenure consistency, credentials</p>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold font-mono ${getScoreColor(feedback.hrManager.score)}`}>
                {feedback.hrManager.score}/100
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-lg text-xs text-slate-300 border-l-2 border-slate-500 leading-relaxed text-justify">
              &ldquo;{feedback.hrManager.critique}&rdquo;
            </div>

            {feedback.hrManager.suggestions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Operational Adjustments:
                </h5>
                <ul className="space-y-1.5">
                  {feedback.hrManager.suggestions.map((sug, i) => (
                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Persona #3: High-Volume Recruiter */}
          <div className="p-5 rounded-xl bg-slate-950/40 border border-white/5 space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-widest font-display">
                    Persona:
                  </span>
                  <span className="text-sm font-semibold text-white font-display">High-Volume Recruiter</span>
                </div>
                <p className="text-[10px] text-amber-300 font-mono">Focused on: 6-second glaze, density, key buzzwords</p>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold font-mono ${getScoreColor(feedback.highVolume.score)}`}>
                {feedback.highVolume.score}/100
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-lg text-xs text-slate-300 border-l-2 border-slate-500 leading-relaxed text-justify">
              &ldquo;{feedback.highVolume.critique}&rdquo;
            </div>

            {feedback.highVolume.suggestions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Scannability remedies:
                </h5>
                <ul className="space-y-1.5">
                  {feedback.highVolume.suggestions.map((sug, i) => (
                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
