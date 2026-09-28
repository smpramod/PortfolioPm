export interface Project {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  tech: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  status?: "building" | "shipped";
  private?: boolean;
}

export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "concept";
  level: number;
}

export interface ExperienceEntry {
  type: "experience" | "training" | "certification";
  title: string;
  org: string;
  period: string;
  description: string;
  tags: string[];
  certificateUrl?: string;
}

export type ContactFormState = {
  ok: boolean;
  error: string;
};
