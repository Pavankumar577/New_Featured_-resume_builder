import { useState } from 'react';
import { DetoxAnalysis } from '../types';
import { ShieldCheck, Flame, Cpu, ArrowRight, Bot, Trash2, HelpCircle } from 'lucide-react';

interface DetoxFilterProps {
  analysis: DetoxAnalysis | null;
  onOptimizeField: () => void;
  isOptimizing: boolean;
  inputText: string;
  onTextChange: (newVal: string) => void;
  onClearInput: () => void;
  onScanText: () => void;
  isScanning: boolean;
}

export default function DetoxFilter({
  analysis,
  onOptimizeField,
  isOptimizing,
  inputText,
  onTextChange,
  onClearInput,
  onScanText,
  isScanning
}: DetoxFilterProps) {

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-400 border-red-500/20 bg-red-500/5';
    if (score >= 40) return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
    return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return 'High Likelihood (AI Clone Detected)';
    if (score >= 40) return 'Moderate AI Structural Traces';
    return 'Highly Humanized & Plain Style';
  };

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <h4 className="text-xs font-bold uppercase text-slate-300 tracking-widest font-display">
            The &ldquo;Anti-AI&rdquo; Content Detox Filter
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-justify">
          Scans and overhauls standard LLM clichés such as &ldquo;spearheaded,&rdquo; &ldquo;delved deep,&rdquo; and &ldquo;testament to&rdquo; that enterprise recruiters instantly flag as artificial output.
        </p>
      </div>

      {/* Manual Checker Workspace */}
      <div className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
            Sandbox Bullet Tester:
          </span>
          {inputText && (
            <button 
              onClick={onClearInput}
              className="text-slate-500 hover:text-slate-300 font-mono text-[9px] uppercase tracking-wider cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          rows={3}
          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-xs focus:border-rose-500 focus:outline-none transition resize-none"
          placeholder="Paste or write raw bullet highlights here to test... e.g., 'I spearheaded global initiatives and delved deep into server metrics as a testament to organizational synergy'"
          value={inputText}
          onChange={(e) => onTextChange(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={onScanText}
            disabled={isScanning || !inputText}
            className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            {isScanning ? 'Detoxing...' : 'Scan & Diagnose Text'}
          </button>
          
          <button
            onClick={onOptimizeField}
            disabled={isOptimizing || !inputText}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Correct</span>
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="text-center py-8">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-[10px] text-slate-400 font-mono">Running Adversarial LLM Word Scan...</p>
        </div>
      )}

      {!isScanning && analysis && (
        <div className="space-y-6">
          {/* Scoring gauge */}
          <div className={`p-4 rounded-xl border space-y-3 ${getScoreColor(analysis.aiLikelihoodScore)}`}>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] uppercase font-bold text-slate-400">AI Likelihood Probability</span>
              <span className="text-xl font-bold font-mono">{analysis.aiLikelihoodScore}%</span>
            </div>
            
            {/* Custom Meter bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getScoreBarColor(analysis.aiLikelihoodScore)}`} 
                style={{ width: `${analysis.aiLikelihoodScore}%` }}
              />
            </div>
            <p className="text-[10px] font-medium font-mono">{getScoreBadge(analysis.aiLikelihoodScore)}</p>
          </div>

          {/* Cliché words detected */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
              Flagged Cliché Incidents ({analysis.flaggedPhrases.length}):
            </h5>
            
            {analysis.flaggedPhrases.length === 0 ? (
              <p className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Fully human presentation verified. No trademark LLM syntax found.
              </p>
            ) : (
              <div className="space-y-2">
                {analysis.flaggedPhrases.map((item, index) => (
                  <div key={index} className="p-3.5 rounded-lg bg-slate-950/60 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-mono text-[10px] font-bold uppercase tracking-wider">
                        &ldquo;{item.phrase}&rdquo;
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <span>Prefer:</span>
                        <span className="text-emerald-400 font-mono font-medium">{item.alternative}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans tracking-wide leading-normal">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Corrected alternative */}
          {analysis.humanizedAlternative && (
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                Detoxified Humanized Alternative:
              </h5>
              <div className="p-4 rounded-xl bg-indigo-950/15 border border-indigo-500/10 space-y-3">
                <p className="text-xs text-white leading-relaxed font-sans text-justify italic">
                  &ldquo;{analysis.humanizedAlternative}&rdquo;
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      onTextChange(analysis.humanizedAlternative || '');
                      onScanText();
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold transition cursor-pointer"
                  >
                    Apply Humanized Text
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
