import { useState } from 'react';
import { Resume, ExperienceItem, EducationItem, ProjectItem, ATSType } from '../types';
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  User, 
  Plus, 
  Trash2, 
  Save, 
  Bot, 
  Flame,
  CheckCircle2, 
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResumeFormProps {
  resume: Resume;
  onChange: (updated: Resume) => void;
  onSave: () => void;
  isSaving: boolean;
  onOptimize: (text: string, onDone: (optText: string) => void) => void;
  isOptimizing: boolean;
  onDetoxAll: (text: string) => void;
}

export default function ResumeForm({ 
  resume, 
  onChange, 
  onSave, 
  isSaving, 
  onOptimize,
  isOptimizing,
  onDetoxAll
}: ResumeFormProps) {
  // Accordion active sections
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'ats'>('profile');

  // Local helper variables to add template items
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      company: 'Acme Corporation',
      role: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2024-01-01',
      endDate: 'Present',
      current: true,
      description: 'Worked in a team to build microservices and responsive web applications. Cooperated on various projects to optimize platform performance.'
    };
    onChange({
      ...resume,
      experience: [...resume.experience, newItem]
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...resume,
      experience: resume.experience.filter(item => item.id !== id)
    });
  };

  const updateExperience = (id: string, key: keyof ExperienceItem, value: any) => {
    onChange({
      ...resume,
      experience: resume.experience.map(item => item.id === id ? { ...item, [key]: value } : item)
    });
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      school: 'Global University',
      degree: 'B.Sc.',
      fieldOfStudy: 'Computer Science',
      location: 'Remote',
      startDate: '2020-09-01',
      endDate: '2024-05-30',
      current: false,
      description: 'Acquired strong fundamentals in computer systems, algorithms, and software design principles.'
    };
    onChange({
      ...resume,
      education: [...resume.education, newItem]
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...resume,
      education: resume.education.filter(item => item.id !== id)
    });
  };

  const updateEducation = (id: string, key: keyof EducationItem, value: any) => {
    onChange({
      ...resume,
      education: resume.education.map(item => item.id === id ? { ...item, [key]: value } : item)
    });
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: 'E-Commerce Platform',
      role: 'Lead Architect',
      description: 'Developed an end-to-end fullstack checkout pipeline leveraging advanced server rendering to maximize conversion rates and sub-second visual responses.',
      url: 'https://github.com/project'
    };
    onChange({
      ...resume,
      projects: [...resume.projects, newItem]
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...resume,
      projects: resume.projects.filter(item => item.id !== id)
    });
  };

  const updateProject = (id: string, key: keyof ProjectItem, value: any) => {
    onChange({
      ...resume,
      projects: resume.projects.map(item => item.id === id ? { ...item, [key]: value } : item)
    });
  };

  const handleSkillsChange = (val: string) => {
    const arr = val.split(',').map(s => s.trim()).filter(Boolean);
    onChange({
      ...resume,
      skills: arr
    });
  };

  const updatePersonal = (key: keyof typeof resume.personalInfo, val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [key]: val
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 overflow-hidden">
      {/* Form Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div>
          <input 
            type="text" 
            className="text-xl font-display font-medium text-white bg-transparent border-b border-transparent hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none w-full transition"
            value={resume.title}
            onChange={(e) => onChange({ ...resume, title: e.target.value })}
            placeholder="Untitled Resume"
          />
          <p className="text-xs text-slate-400 mt-1">Core Resume Editor</p>
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/10 cursor-pointer"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
      </div>

      {/* Accordion List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Contact Info Accordion */}
        <div className="border border-white/5 rounded-xl bg-slate-950/20 overflow-hidden">
          <button 
            type="button"
            onClick={() => setActiveTab(activeTab === 'profile' ? 'profile' : 'profile')}
            className="w-full flex items-center justify-between p-4 font-medium text-white hover:bg-white/5 transition text-left"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-400" />
              <span className="font-display">1. Personal & Contact Profile</span>
            </div>
          </button>
          
          <div className="p-4 border-t border-white/5 space-y-4 bg-slate-950/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                  value={resume.personalInfo.name}
                  onChange={(e) => updatePersonal('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Professional Title</label>
                <input 
                  type="text"
                  placeholder="Senior Software Engineer"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                  value={resume.personalInfo.title}
                  onChange={(e) => updatePersonal('title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <input 
                  type="email"
                  placeholder="jane.doe@example.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                  value={resume.personalInfo.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                <input 
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                  value={resume.personalInfo.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Website / Portfolio</label>
                <input 
                  type="text"
                  placeholder="https://janedoe.dev"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                  value={resume.personalInfo.website}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                <input 
                  type="text"
                  placeholder="New York, NY"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                  value={resume.personalInfo.location}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-400">Professional Summary</label>
                <button
                  type="button"
                  onClick={() => onOptimize(resume.personalInfo.summary, (res) => updatePersonal('summary', res))}
                  className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer uppercase tracking-wider"
                >
                  <Bot className="w-3.5 h-3.5" /> AI Humanizer
                </button>
              </div>
              <textarea 
                rows={4}
                className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none transition resize-none"
                placeholder="Write a high-impact intro summary... e.g. 'Highly motivated software engineer with 6+ years of expertise in fullstack web architecture...'"
                value={resume.personalInfo.summary}
                onBlur={() => onDetoxAll(resume.personalInfo.summary)}
                onChange={(e) => updatePersonal('summary', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="border border-white/5 rounded-xl bg-slate-950/20 overflow-hidden">
          <div className="w-full flex items-center justify-between p-4 font-medium text-white hover:bg-white/5 transition">
            <button 
              type="button"
              onClick={() => setActiveTab(activeTab === 'experience' ? 'profile' : 'experience')}
              className="flex items-center gap-3 text-left flex-1"
            >
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span className="font-display">2. Professional Experience ({resume.experience.length})</span>
            </button>
            <button 
              type="button" 
              onClick={addExperience}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {activeTab === 'experience' && (
            <div className="p-4 border-t border-white/5 space-y-4 bg-slate-950/40">
              {resume.experience.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">No experience items registered. Click Add above.</p>
              ) : (
                resume.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-slate-900/60 rounded-xl relative border border-white/5">
                    <button 
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="inline-block bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold py-0.5 px-2 rounded-md mb-3">
                      Experience Role #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Company</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Professional Role</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Time Frame</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            placeholder="Jan 2021"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                          <input 
                            type="text"
                            placeholder="Present"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <input 
                        type="checkbox" 
                        id={`current-${exp.id}`}
                        className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-indigo-500"
                        checked={exp.current}
                        onChange={(e) => {
                          updateExperience(exp.id, 'current', e.target.checked);
                          if (e.target.checked) {
                            updateExperience(exp.id, 'endDate', 'Present');
                          }
                        }}
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-400">Current Employment</label>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-400">Responsibilities & Achieved Metrics</label>
                        <button
                          type="button"
                          onClick={() => onOptimize(exp.description, (res) => updateExperience(exp.id, 'description', res))}
                          className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer uppercase tracking-wider"
                        >
                          <Bot className="w-3.5 h-3.5" /> AI Humanizer
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition resize-none"
                        value={exp.description}
                        onBlur={() => onDetoxAll(exp.description)}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Bullet points: Spearheaded software optimizations..."
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Education Accordion */}
        <div className="border border-white/5 rounded-xl bg-slate-950/20 overflow-hidden">
          <div className="w-full flex items-center justify-between p-4 font-medium text-white hover:bg-white/5 transition">
            <button 
              type="button"
              onClick={() => setActiveTab(activeTab === 'education' ? 'profile' : 'education')}
              className="flex items-center gap-3 text-left flex-1"
            >
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span className="font-display">3. Education & Credentials ({resume.education.length})</span>
            </button>
            <button 
              type="button" 
              onClick={addEducation}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {activeTab === 'education' && (
            <div className="p-4 border-t border-white/5 space-y-4 bg-slate-950/40">
              {resume.education.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">No education records cataloged. Click Add above.</p>
              ) : (
                resume.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-900/60 rounded-xl relative border border-white/5">
                    <button 
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="inline-block bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold py-0.5 px-2 rounded-md mb-3">
                      Institution #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">School / Academy</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Degree Achieved</label>
                        <input 
                          type="text"
                          placeholder="M.Sc. / B.Sc. / Certified"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Field of Study</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Years Attended</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            placeholder="2016"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                          <input 
                            type="text"
                            placeholder="2020"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Skills Accordion */}
        <div className="border border-white/5 rounded-xl bg-slate-950/20 overflow-hidden">
          <button 
            type="button"
            onClick={() => setActiveTab(activeTab === 'skills' ? 'profile' : 'skills')}
            className="w-full flex items-center justify-between p-4 font-medium text-white hover:bg-white/5 transition text-left"
          >
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-indigo-400" />
              <span className="font-display">4. Professional Skills</span>
            </div>
          </button>
          
          {activeTab === 'skills' && (
            <div className="p-4 border-t border-white/5 space-y-4 bg-slate-950/40">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Key Tech and Human Skills (Comma separated)</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-indigo-500 focus:outline-none transition font-mono"
                  placeholder="React, TypeScript, GraphQL, Node.js, Kubernetes, Rust, System Architecture"
                  value={resume.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {resume.skills.length === 0 ? (
                  <span className="text-xs text-slate-500 font-mono">No tags registered.</span>
                ) : (
                  resume.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-white/5">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Projects Accordion */}
        <div className="border border-white/5 rounded-xl bg-slate-950/20 overflow-hidden">
          <div className="w-full flex items-center justify-between p-4 font-medium text-white hover:bg-white/5 transition">
            <button 
              type="button"
              onClick={() => setActiveTab(activeTab === 'projects' ? 'profile' : 'projects')}
              className="flex items-center gap-3 text-left flex-1"
            >
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <span className="font-display">5. Capital Projects ({resume.projects.length})</span>
            </button>
            <button 
              type="button" 
              onClick={addProject}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {activeTab === 'projects' && (
            <div className="p-4 border-t border-white/5 space-y-4 bg-slate-950/40">
              {resume.projects.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">No capital projects cataloged. Click Add above.</p>
              ) : (
                resume.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-4 bg-slate-900/60 rounded-xl relative border border-white/5">
                    <button 
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="inline-block bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold py-0.5 px-2 rounded-md mb-3">
                      Project #{idx + 1}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Project Name</label>
                        <input 
                          type="text"
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Link URL</label>
                        <input 
                          type="text"
                          placeholder="https://..."
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition"
                          value={proj.url}
                          onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-400">Description</label>
                        <button
                          type="button"
                          onClick={() => onOptimize(proj.description, (res) => updateProject(proj.id, 'description', res))}
                          className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer uppercase tracking-wider"
                        >
                          <Bot className="w-3.5 h-3.5" /> AI Humanizer
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition resize-none"
                        value={proj.description}
                        onBlur={() => onDetoxAll(proj.description)}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Project outcomes and architecture details..."
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ATS Selecting */}
        <div className="border border-white/5 rounded-xl bg-indigo-950/10 overflow-hidden">
          <button 
            type="button"
            onClick={() => setActiveTab(activeTab === 'ats' ? 'profile' : 'ats')}
            className="w-full flex items-center justify-between p-4 font-medium text-white hover:bg-white/5 transition text-left"
          >
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span className="font-display">6. Target ATS Compiler Config</span>
            </div>
          </button>
          
          {activeTab === 'ats' && (
            <div className="p-4 border-t border-white/5 space-y-4 bg-indigo-950/20">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Enterprise ATS Platform</label>
                <select 
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
                  value={resume.atsType}
                  onChange={(e) => onChange({ ...resume, atsType: e.target.value as ATSType })}
                >
                  <option value="workday">Workday Parse Engine</option>
                  <option value="greenhouse">Greenhouse Tag Compiler</option>
                  <option value="lever">Lever Chrono Mapper</option>
                </select>
                <p className="text-[11px] text-indigo-300 mt-2">
                  Choosing a target platform configures our real-time Vendor-Specific Simulator to audit parser vulnerabilities on this specific vendor script.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
