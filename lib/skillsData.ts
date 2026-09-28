import type { Skill } from "./types";

export const skills: Skill[] = [
  { name: "JavaScript", category: "language", level: 90 },
  { name: "TypeScript", category: "language", level: 80 },
  { name: "Java", category: "language", level: 72 },
  { name: "HTML", category: "language", level: 95 },
  { name: "CSS", category: "language", level: 88 },
  { name: "SQL", category: "language", level: 75 },

  { name: "React", category: "framework", level: 88 },
  { name: "Next.js", category: "framework", level: 85 },
  { name: "Node.js", category: "framework", level: 78 },
  { name: "NestJS", category: "framework", level: 78 },
  { name: "Tailwind CSS", category: "framework", level: 90 },
  { name: "ShadCN", category: "framework", level: 82 },

  { name: "Git", category: "tool", level: 85 },
  { name: "MongoDB", category: "tool", level: 80 },
  { name: "Azure Boards", category: "tool", level: 78 },
  { name: "Postman", category: "tool", level: 80 },
  { name: "Vercel", category: "tool", level: 82 },
  { name: "Figma", category: "tool", level: 70 },

  { name: "REST APIs", category: "concept", level: 88 },
  { name: "Input Validation", category: "concept", level: 82 },
  { name: "Agile / Scrum", category: "concept", level: 84 },
  { name: "Code Review", category: "concept", level: 80 },
];

export const skillTabs = [
  { id: "language", label: "Languages" },
  { id: "framework", label: "Frameworks" },
  { id: "tool", label: "Tools" },
  { id: "concept", label: "Concepts" },
] as const;
