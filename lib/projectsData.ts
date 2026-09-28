import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "college-erp",
    title: "College ERP System",
    description:
      "Multi-tenant College ERP at Seratek Systems — Academics, Scholarships, Admissions, and admin masters on Next.js, NestJS, and MongoDB.",
    bullets: [
      "Built Academics and Scholarship modules covering student records, course management, and scholarship allocation",
      "Developed admin master modules (programs, degrees, config) and the online Admission Form with a reusable ShadCN/Tailwind library",
      "Optimized NestJS REST APIs on MongoDB, reducing response latency by 25%",
      "Ran Agile sprints with Azure Boards, improving delivery time by 15%",
    ],
    tech: ["Next.js", "NestJS", "TypeScript", "Tailwind CSS", "ShadCN", "MongoDB"],
    image: "/projects/erp.svg",
    status: "building",
    private: true,
  },
  {
    id: "park-o",
    title: "Parko — Online Parking System",
    description:
      "Role-based parking platform with Leaflet maps, automated fees, and Admin / User / Entry-Exit Operator access.",
    bullets: [
      "Built a role-based parking platform for finding and booking spaces across three user roles",
      "Integrated Leaflet maps for real-time parking location visualization",
      "Automated time-based fee calculation",
      "Deployed the full-stack app on Vercel",
    ],
    tech: ["Next.js", "Node.js", "JavaScript", "Leaflet", "Vercel"],
    image: "/projects/parko.svg",
    status: "shipped",
    githubUrl: "https://github.com/abhifarande1008/Parko---Online-Parking-System",
  },
  {
    id: "diploma-aspirants",
    title: "Diploma Aspirants App",
    description:
      "Android app for diploma students to access shared study materials with Firebase auth and real-time sync.",
    bullets: [
      "Built a centralized Android app for diploma students to access shared study materials",
      "Integrated Firebase authentication and real-time sync",
      "Improved study access and reduced resource duplication",
    ],
    tech: ["Android Studio", "Firebase"],
    image: "/projects/diploma.svg",
    status: "shipped",
    githubUrl: "https://github.com/abhifarande1008/Diploma-Aspirants-Android-App",
  },
];
