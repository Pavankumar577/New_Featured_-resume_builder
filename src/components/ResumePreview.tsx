import { useRef } from 'react';
import { Resume } from '../types';
import { Printer, Eye, Zap, MapPin, Globe, Phone, Mail, Award } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
}

export default function ResumePreview({ resume, showHeatmap, onToggleHeatmap }: ResumePreviewProps) {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const { personalInfo, experience, education, skills, projects } = resume;

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 overflow-hidden">
      {/* Action Tools */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 no-print">
        <h3 className="text-sm font-display font-medium text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          Live Document Preview
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleHeatmap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              showHeatmap 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-300 border-white/5 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {showHeatmap ? 'Disable Heatmap' : 'Simulate 6s Heatmap'}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium border border-transparent transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print to PDF
          </button>
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="flex-1 overflow-y-auto bg-slate-950/20 rounded-xl p-4 pr-1 scroll-container relative">
        {/* Heatmap Overlays */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
            {/* Eye Fixation Hotspot 1: Header/Name */}
            <div className="absolute top-[8%] left-[10%] w-48 h-16 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="absolute top-[9%] left-[15%] w-12 h-12 bg-red-600/30 blur-xl rounded-full" />
            
            {/* Eye Fixation Hotspot 2: Role Summary */}
            <div className="absolute top-[18%] left-[8%] w-72 h-12 bg-orange-500/15 blur-2xl rounded-full" />
            
            {/* Eye Fixation Hotspot 3: First Company & Role */}
            <div className="absolute top-[28%] left-[12%] w-60 h-10 bg-yellow-500/15 blur-xl rounded-full" />
            
            {/* Eye Fixation Hotspot 4: Skills Section Header */}
            <div className="absolute bottom-[20%] left-[8%] w-40 h-8 bg-green-500/15 blur-xl rounded-full" />

            {/* Quick scanning flow lines */}
            <div className="absolute top-[9%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="absolute top-[28%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
            <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-400/20 to-transparent" />

            <div className="absolute top-4 right-4 bg-red-600 text-white font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest no-print animate-pulse shadow-md shadow-red-900/30">
              6-Second Scan Overlay Active
            </div>
          </div>
        )}

        {/* Real Document Sheet */}
        <div 
          ref={printRef}
          className="print-page w-full min-h-[750px] bg-white text-slate-900 shadow-xl p-8 rounded-lg border border-slate-200 flex flex-col justify-between overflow-visible transition text-left"
        >
          <div className="print-container">
            {/* Header / Personal Grid */}
            <div className="border-b-2 border-slate-900 pb-5 mb-5 relative">
              <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 mb-1">
                {personalInfo.name || 'Jane Doe'}
              </h1>
              <p className="text-lg font-medium text-slate-700 tracking-wide mb-3">
                {personalInfo.title || 'Senior Software Scientist'}
              </p>

              {/* Dynamic Contact Row */}
              <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs font-medium text-slate-500 font-mono">
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    {personalInfo.phone}
                  </span>
                )}
                {personalInfo.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    {personalInfo.website}
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    {personalInfo.location}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Intro Summary */}
            {personalInfo.summary && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 border-b border-slate-300 pb-1 font-display">
                  Professional Profile
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-sans text-justify">
                  {personalInfo.summary}
                </p>
              </div>
            )}

            {/* Work History */}
            {experience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1 font-display">
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between items-baseline mb-1">
                        <div>
                          <strong className="text-[13px] text-slate-900 font-bold">{exp.role}</strong>
                          <span className="text-slate-500 font-medium font-mono text-[11px]"> @ {exp.company}</span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] text-right">
                          {exp.startDate} – {exp.endDate} | {exp.location}
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-line text-justify pl-2 border-l border-slate-200">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Capital Projects */}
            {projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1 font-display">
                  Key Projects & Releases
                </h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="text-xs">
                      <div className="flex justify-between items-baseline mb-1">
                        <strong className="text-[13px] text-slate-900 font-bold">{proj.name}</strong>
                        {proj.url && (
                          <span className="text-[10px] text-indigo-600 font-mono underline">{proj.url}</span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed pl-2 border-l border-slate-200 text-justify">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education History */}
            {education.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1 font-display">
                  Education & Credentials
                </h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs flex justify-between items-baseline">
                      <div>
                        <strong className="text-slate-900 font-bold">{edu.degree} inside {edu.fieldOfStudy}</strong>
                        <div className="text-slate-500 mt-0.5">{edu.school}</div>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] text-right">
                        {edu.startDate} – {edu.endDate} | {edu.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {skills.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 border-b border-slate-300 pb-1 font-display">
                  Professional Core Competencies
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-800 leading-relaxed">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-[11px] font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer watermark to give premium look */}
          <div className="mt-8 border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>ATS-Ready Compiled Document</span>
            <span>Ref: {resume.id.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
