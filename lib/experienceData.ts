import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    type: "experience",
    title: "Backend Developer",
    org: "Seratek Systems",
    period: "Feb 2026 – Present",
    description:
      "Shipping production backend features for a live ERP product using NestJS, Redis, MongoDB, and TypeScript. Architected a centralized cascading soft-delete mechanism ensuring safe data retirement; redesigned real-time push notifications with socket rooms reducing calls by 80%; engineered a throttled OTP auth framework with account lockout defense; and built an in-house SMS gateway for transactional notifications.",
    tags: ["NestJS", "TypeScript", "Redis", "MongoDB", "Socket.IO", "BullMQ", "Agile / Scrum"],
  },
  {
    type: "experience",
    title: "IoT Application Developer Intern",
    org: "Softron, Kolhapur",
    period: "Jun 2022 – Aug 2022",
    description:
      "Engineered IoT prototypes using Arduino, ESP8266, and ESP32 microcontrollers for real-time sensor monitoring; connected telemetry data into custom local dashboards for live readings.",
    tags: ["IoT", "ESP32", "ESP8266", "Arduino", "Sensors", "Dashboard"],
  },
  {
    type: "certification",
    title: "Cloud Computing",
    org: "NPTEL – IIT Kharagpur",
    period: "Certified",
    description:
      "Comprehensive certification covering distributed cloud architectures, virtualization models, resource scheduling, cloud storage, and security.",
    tags: ["Cloud Computing", "Virtualization", "Distributed Systems"],
    certificateUrl: "https://drive.google.com/file/d/1A1F_-iPzlDAzUXJfev9cthcJa0_E6xj7/view?usp=drivesdk",
  },
  {
    type: "certification",
    title: "Introduction to Data Science",
    org: "Infosys SpringBoard",
    period: "Certified",
    description:
      "Foundational data science covering exploratory data analysis (EDA), statistical modeling, dataset wrangling, and predictive data workflows using Python.",
    tags: ["Data Science", "Python", "EDA", "Statistics"],
    certificateUrl: "https://drive.google.com/file/d/1xTDGeHLkLlC5sS-OWbJJwzJrXAmRuklv/view?usp=drive_link",
  },
  {
    type: "certification",
    title: "Google Cloud Arcade Facilitator Program",
    org: "Google Cloud (GCP)",
    period: "Certified",
    description:
      "Hands-on labs and skill badges spanning Google Cloud infrastructure, Cloud IAM, containerized workloads, and networking essentials.",
    tags: ["GCP", "Cloud IAM", "Cloud Storage", "Containers"],
  },
];
