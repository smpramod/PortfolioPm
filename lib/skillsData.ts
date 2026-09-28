import type { Skill } from "./types";

export const skills: Skill[] = [
  { name: "JavaScript", category: "language", level: 90 },
  { name: "TypeScript", category: "language", level: 88 },
  { name: "Java", category: "language", level: 88 },
  { name: "Python", category: "language", level: 82 },
  { name: "SQL (MySQL)", category: "language", level: 85 },
  { name: "HTML5 & CSS3", category: "language", level: 92 },

  { name: "NestJS", category: "framework", level: 92 },
  { name: "Node.js & Express", category: "framework", level: 88 },
  { name: "React.js", category: "framework", level: 85 },
  { name: "Next.js", category: "framework", level: 80 },
  { name: "Android SDK (Java)", category: "framework", level: 82 },
  { name: "Flutter", category: "framework", level: 78 },

  { name: "Redis", category: "tool", level: 88 },
  { name: "MongoDB", category: "tool", level: 88 },
  { name: "MySQL", category: "tool", level: 85 },
  { name: "BullMQ & CronJob", category: "tool", level: 84 },
  { name: "Git & GitHub", category: "tool", level: 88 },
  { name: "GCP & Firebase", category: "tool", level: 80 },
  { name: "Railway & Vercel", category: "tool", level: 85 },
  { name: "Postman", category: "tool", level: 86 },

  { name: "Data Structures & Algorithms", category: "concept", level: 90 },
  { name: "Object-Oriented Programming (OOP)", category: "concept", level: 92 },
  { name: "Database Management (DBMS)", category: "concept", level: 88 },
  { name: "Computer Networks & OS", category: "concept", level: 84 },
  { name: "Real-time Socket.IO", category: "concept", level: 88 },
  { name: "OTP & Auth Security", category: "concept", level: 90 },
  { name: "REST APIs & Architecture", category: "concept", level: 90 },
  { name: "Agile / Scrum Delivery", category: "concept", level: 86 },
];

export const skillTabs = [
  { id: "language", label: "Languages" },
  { id: "framework", label: "Frameworks" },
  { id: "tool", label: "Tools & Cloud" },
  { id: "concept", label: "Core & Systems" },
] as const;
