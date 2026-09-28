import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "cafe-platform",
    title: "Black & White Cafe Platform",
    description:
      "Full-stack cafe management and ordering platform across Flutter mobile and React/Next.js web, featuring live order tracking, guest checkout, and reward mechanics.",
    bullets: [
      "Architected a dual-platform cafe ecosystem (Flutter mobile + React/Next.js web) handling dynamic menu browsing, guest/authenticated ordering, rewards, and bookings",
      "Built high-throughput NestJS & MongoDB APIs with JWT authentication, guest sessions, throttling, validation, and idempotency",
      "Engineered real-time order tracking and kitchen notifications using Socket.IO event rooms",
      "Automated production deployments and CI/CD pipelines across Vercel (web) and Railway (backend)",
    ],
    tech: ["Flutter", "NestJS", "React", "Next.js", "MongoDB", "Socket.IO", "JWT", "Railway", "Vercel"],
    image: "/projects/cafe.svg",
    status: "shipped",
    liveUrl: "https://blackandwhitecafe.vercel.app/",
  },
  {
    id: "clinic-management",
    title: "Gurudatta Clinic Management Application",
    description:
      "Sponsored Android application managing 200+ patient medical records and appointments with structured SQLite persistence.",
    bullets: [
      "Designed and deployed a modular Android application in Java managing 200+ patient records and appointments with structured SQLite storage",
      "Structured SQLite database schemas with relational query optimizations and secure doctor authentication",
      "Followed the full SDLC from requirement analysis to clinic deployment, reducing manual record-keeping by 95%",
      "Engineered intuitive XML layouts following Material Design guidelines for rapid clinical workflows",
    ],
    tech: ["Java", "Android Studio", "SQLite", "XML", "Local Storage", "UI/UX"],
    image: "/projects/clinic.svg",
    status: "shipped",
    githubUrl: "https://github.com/smpramod/hospital_mngt",
  },
  {
    id: "smartcrop-ai",
    title: "SmartCrop — AI Crop Disease Prediction",
    description:
      "Deep learning crop disease classifier achieving 88% accuracy across 8,000 images with Python, TensorFlow, and full-stack web dashboard.",
    bullets: [
      "Programmed a CNN-based crop disease classifier achieving 88% accuracy on a dataset of 8,000 images using TensorFlow/PyTorch",
      "Processed and augmented datasets using Python, NumPy, and Pandas for model training, statistical analysis, and prediction optimization",
      "Introduced validation checks, debugging workflows, and performance tracking with disciplined Git version control",
      "Integrated model inference into a React.js & Node.js dashboard with automated PDF diagnostic generation via PDFKit",
    ],
    tech: ["Python", "TensorFlow", "PyTorch", "React.js", "Node.js", "MongoDB", "NumPy", "Pandas"],
    image: "/projects/smartcrop.svg",
    status: "shipped",
    githubUrl: "https://github.com/smpramod/DiseasePredicition",
  },
];
