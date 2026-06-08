export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  title: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  description: string;
  url: string;
}

export type ATSType = 'workday' | 'greenhouse' | 'lever';

export interface Resume {
  id: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  atsType: ATSType;
  createdAt?: any;
  updatedAt?: any;
}

export interface RecruiterFeedback {
  techLead: {
    score: number; // 0-100
    critique: string;
    suggestions: string[];
  };
  hrManager: {
    score: number; // 0-100
    critique: string;
    suggestions: string[];
  };
  highVolume: {
    score: number; // 0-100
    critique: string;
    suggestions: string[];
  };
}

export interface ATSAnalysis {
  score: number; // 0-100
  readabilityLevel: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
  warnings: string[];
  blueprint: string; // Describes how data mapping occurred
  remedy: string[];
}

export interface DetoxAnalysis {
  flaggedPhrases: Array<{
    phrase: string;
    alternative: string;
    explanation: string;
  }>;
  aiLikelihoodScore: number; // 0-100
  humanizedAlternative?: string;
}
