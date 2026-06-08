import { useState, useEffect } from 'react';
import { Resume, ATSAnalysis } from '../types';
import { Cpu, CheckCircle, AlertTriangle, Hammer, BookOpen, Layers } from 'lucide-react';

interface ATSPipelineProps {
  resume: Resume;
  analysis: ATSAnalysis | null;
  onRunAnalysis: () => void;
  isLoading: boolean;
}

export default function ATSPipeline({ resume, analysis, onRunAnalysis, isLoading }: ATSPipelineProps) {
  // Trigger audit on change of target ATS Type automatically to make it responsive!
  useEffect(() => {
    onRunAnalysis();
  }, [resume.atsType]);

  const getATSDetails = () => {
    switch (resume.atsType) {
      case 'workday':
        return {
          title: 'Workday Parse Engine v3.34',
          description: 'Used by 70% of Fortune 500 vendors. Highly sensitive to multi-column components or tables, translating layouts strictly into standard sequential text blocks.',
          guidelines: 'Ensure skills are clearly isolated under simple headings.'
        };
      case 'greenhouse':
        return {
          title: 'Greenhouse Tag Compiler',
          description: 'Used extensively in technology setups. Attempts to parse skill tokens into individual entities to calculate weighted relevance counts.',
          guidelines: 'Format core competencies comma-separated for tag indexing.'
        };
      case 'lever':
        return {
          title: 'Lever Chrono Mapper',
          description: 'Lever prioritizes timeline consistency, role mapping, and section text-density. Triggers parser alarms if employment period syntax is irregular.',
          guidelines: 'Use standard date intervals (e.g. "2024-01-01 to Present").'
        };
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excellent':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'Good':
        return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
      case 'Needs Improvement':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      default:
        return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Info */}
      <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-500/10 space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase text-slate-300 tracking-widest font-display">
            Active Simulator Profile
          </h4>
        </div>
        <p className="text-xs font-semibold text-white font-display">
          {getATSDetails().title}
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          {getATSDetails().description}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 border border-white/5 bg-slate-950/15 rounded-xl space-y-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Compiling Extracted Readability Schema...</p>
        </div>
      ) : !analysis ? (
        <div className="text-center py-8">
          <button 
            onClick={onRunAnalysis}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
          >
            Force Parse Compilation
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Scoring Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${getLevelColor(analysis.readabilityLevel)}`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-display">ATS Parser Score</span>
              <span className="text-2xl font-bold font-mono mt-1">{analysis.score}%</span>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${getLevelColor(analysis.readabilityLevel)}`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Sim Status</span>
              <span className="text-xs font-bold font-display mt-1 tracking-wide">{analysis.readabilityLevel}</span>
            </div>
          </div>

          {/* Extracted Schema Blueprint View */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Parsed Extracted Blueprint View:
            </h5>
            <div className="p-4 rounded-xl bg-slate-950 border border-white/5 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              <span className="text-indigo-400 font-bold">// EXTRACTED NODE INDEX SCHEMAS:</span>
              <p className="mt-2 text-slate-400">{analysis.blueprint}</p>
            </div>
          </div>

          {/* Parser Warnings / Incidents */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Parser Warnings & Blockers ({analysis.warnings.length}):
            </h5>
            {analysis.warnings.length === 0 ? (
              <p className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> No compiler warnings triggers. Layout parsing fully reliable.
              </p>
            ) : (
              <div className="space-y-1.5">
                {analysis.warnings.map((warn, i) => (
                  <p key={i} className="text-[11px] text-amber-300 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex items-start gap-2 leading-normal">
                    <span className="font-bold text-[13px] leading-none shrink-0">!</span>
                    {warn}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Custom Remedy Panel */}
          {analysis.remedy.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <Hammer className="w-3.5 h-3.5 text-indigo-400" /> Actionable Remedy Blueprints:
              </h5>
              <div className="space-y-1.5">
                {analysis.remedy.map((rem, i) => (
                  <div key={i} className="p-3 bg-slate-900/40 rounded-lg border border-white/5 flex items-start gap-2">
                    <span className="text-xs text-indigo-400 font-bold shrink-0 mt-0.5">{i+1}.</span>
                    <p className="text-[11px] text-slate-300 leading-normal font-sans text-justify">{rem}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
