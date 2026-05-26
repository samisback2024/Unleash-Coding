import { supabase } from "@/lib/supabase";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export type ResumeTemplate = "modern" | "minimal" | "classic";

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
  };
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: {
    technical: string[];
    languages: string[];
    tools: string[];
    soft: string[];
  };
  projects: ResumeProject[];
  certifications: ResumeCertification[];
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: { technical: [], languages: [], tools: [], soft: [] },
  projects: [],
  certifications: [],
};

export async function getResumeProfile(
  userId: string,
): Promise<{ data: ResumeData; template: ResumeTemplate } | null> {
  const { data, error } = await db
    .from("resume_profiles")
    .select("data, template")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data
    ? {
        data: data.data as ResumeData,
        template: data.template as ResumeTemplate,
      }
    : null;
}

export async function saveResumeProfile(
  userId: string,
  resumeData: ResumeData,
  template: ResumeTemplate,
): Promise<void> {
  const { error } = await db
    .from("resume_profiles")
    .upsert({
      user_id: userId,
      data: resumeData,
      template,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}
