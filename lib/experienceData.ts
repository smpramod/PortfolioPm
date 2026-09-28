import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    type: "experience",
    title: "Software Developer",
    org: "Seratek Systems (formerly Akron Systems)",
    period: "Jan 2026 – Present",
    description:
      "Building and maintaining Academics and Scholarship modules of a multi-tenant College ERP — student records, course management, scholarship allocation, admin masters, and the online Admission Form. Optimized NestJS REST APIs on MongoDB (25% lower latency) and ran Agile sprints with Azure Boards.",
    tags: ["Next.js", "NestJS", "MongoDB", "ShadCN", "Tailwind CSS", "Azure Boards"],
  },
  {
    type: "experience",
    title: "Software Developer Intern",
    org: "Seratek Systems (formerly Akron Systems)",
    period: "June 2025 – Dec 2025",
    description:
      "Built responsive multi-role UI pages with ShadCN and Tailwind CSS, shipping dynamic forms and full CRUD workflows. Built and tested NestJS REST APIs with MongoDB for student, course, and scholarship modules, including backend validation.",
    tags: ["Next.js", "NestJS", "TypeScript", "MongoDB", "ShadCN"],
  },
];
