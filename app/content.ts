// All content for the site lives here — edit this file to update the pages.

import {
  Bot,
  Brain,
  CircuitBoard,
  ClipboardCheck,
  Code,
  Crosshair,
  FileUp,
  GraduationCap,
  type LucideIcon,
  Route,
  Server,
  SlidersHorizontal,
  Smartphone,
  Target,
  Zap,
} from "lucide-react";

export const profile = {
  name: "Chanon Wichai",
  role: "a Computer Engineering student",
  intro:
    "I enjoy turning ideas into practical projects across software, embedded systems, IoT and AI, and I learn new technologies by building things myself.",
  current: { label: "KMUTNB", href: "https://www.kmutnb.ac.th/" },
  // Hero photo — the file lives in /public. Replace public/profile.jpg with your own picture.
  photo: "/profile.jpg",
};

export const socials = {
  github: "https://github.com/Chanonwc",
  linkedin: "#",
  instagram: "https://www.instagram.com/chanon.wc/",
  email: "mailto:wc.chanon@gmail.com"
};

// GitHub username used by the Stats section.
export const githubUsername = "Chanonwc";

// Sections of the single page, in order — drives the top navigation.
// `id` is the anchor on the page, `label` is the text shown in the nav.
export const sections = [
  { id: "home", label: "about" },
  { id: "projects", label: "project" },
  { id: "skill", label: "skill" },
  { id: "stats", label: "stats" },
];

export type Project = {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  badges: string[];
  role: string;
  date: string;
  summary: string;
  bullets: string[];
  stack: string[];
  // Photos for the hover preview on the timeline — put files in /public/projects/<slug>/
  // and list them here, e.g. ["/projects/3d-probecode/app.png"]. Several photos swap automatically.
  images?: string[];
  // Everything below is optional and only shown on the project's detail page.
  description?: string;
  detailStack?: string[];
  // GitHub repo — shown as a "GitHub" button on the timeline.
  github?: string;
  // Extra buttons on the timeline, e.g. { label: "Demo", href: "https://..." }.
  links?: { label: string; href: string }[];
  stats?: { value: string; label: string }[];
  steps?: { icon: LucideIcon; title: string; text: string }[];
  highlights?: { title: string; text: string }[];
};

// The first project is shown as the wide, featured card.
export const projects: Project[] = [
  {
    slug: "3d-probecode",
    title: "3D-ProbeCode",
    icon: Crosshair,
    tagline: "Capstone project · CMM path planner",
    badges: ["Capstone", "Lead Developer"],
    role: "Lead Developer",
    date: "2026 – Present",
    summary:
      "A CMM (Coordinate Measuring Machine) path planner in Python, built as a duo: it reads a STEP model, detects holes, pockets and slots, generates a GRBL probing program, then imports the machine log to measure each hole's diameter, offset and roundness against the CAD.",
    bullets: [
      "Detects holes, counterbores, pockets, slots and runner channels from the STEP B-Rep",
      "Probe-aware planning with 3D preview, axis / hole-center tests and G38.2 G-code export",
      "Evaluation with probe-radius compensation and least-squares circle fit (diameter, roundness)",
    ],
    stack: ["Python", "CustomTkinter", "CadQuery / OpenCascade", "trimesh", "NumPy", "G-code (GRBL)"],
    description:
      "Our final-year project, built as a duo: a CNC machine fitted with a touch probe, and the software that tells it where to measure. You load a CAD model of a mould or part, the app finds every hole, pocket and slot that needs inspecting, and it writes a G-code program that probes each feature's walls layer by layer. After the job runs, the machine's log comes back into the app, which compares the measured points with the CAD model and reports each hole's deviation, diameter and roundness.",
    detailStack: [
      "Python",
      "CustomTkinter",
      "CadQuery / OpenCascade",
      "trimesh",
      "NumPy",
      "Matplotlib",
      "G-code (GRBL)",
    ],
    github: "https://github.com/Mold-Inspection/3D-ProbeCode",
    images: [
      "/projects/3Dprobe/01-hole-detection.png",
      "/projects/3Dprobe/02-probe-path-3d.png",
      "/projects/3Dprobe/03-evaluation.png",
    ],
    stats: [
      { value: "139", label: "Commits" },
      { value: "63", label: "Pull requests merged" },
      { value: "11k", label: "Lines of Python" },
      { value: "2", label: "Developers" },
    ],
    steps: [
      {
        icon: FileUp,
        title: "Load CAD",
        text: "Open a STEP/STP file; the B-Rep is kept for exact hole maths and meshed for display.",
      },
      {
        icon: Target,
        title: "Detect holes",
        text: "Cylinders, cones and counterbores are extracted analytically, with a mesh-clustering fallback.",
      },
      {
        icon: SlidersHorizontal,
        title: "Plan probing",
        text: "Per hole: layers, points per layer, zigzag mode. A 3D preview warns if the stylus can't reach or fit.",
      },
      {
        icon: Route,
        title: "Route",
        text: "Holes are ordered with a nearest-neighbour path and previewed in the Path Mapper tab.",
      },
      {
        icon: Code,
        title: "Export G-code",
        text: "GRBL-style G38.2 probe moves in real 3D machine coordinates, ready to run.",
      },
      {
        icon: ClipboardCheck,
        title: "Evaluate",
        text: "Import the OpenBuilds Control log and compare probed points against the expected ones.",
      },
    ],
    highlights: [
      {
        title: "Six-view inspection",
        text: "Top, bottom, front, back, left and right views with a 2D depth map: zoom, rotate, hover to read depth and pin measurements.",
      },
      {
        title: "Smart hole list",
        text: "Detected holes are numbered on the view and sorted into selected / unselected, with reasons such as “too shallow” or “occluded”.",
      },
      {
        title: "Probe-aware planning",
        text: "Stylus length and tip diameter are checked against every hole so the plan never asks the machine for an impossible move.",
      },
      {
        title: "Closed loop",
        text: "Settings are saved with the exported schema so a probing run can be matched back to the exact plan that produced it.",
      },
    ],
  },
  {
    slug: "e-pretest",
    title: "E-Pretest",
    icon: GraduationCap,
    tagline: "AI pre-test platform for KMUTNB students · team project",
    badges: ["Software Tester"],
    role: "Software Tester",
    date: "2025",
    summary:
      "Designed UAT scenarios and ran hands-on functional testing for an AI pre-test platform that turns lecture PDFs into adaptive multiple-choice exams with DeepSeek, then gives each student a GAP analysis of their weak topics.",
    bullets: [
      "Designed UAT scenarios across the student and admin journeys",
      "Hands-on functional testing: KMUTNB Google login, PDF upload, AI quiz, exam and GAP analysis",
      "Platform: React, FastAPI, PostgreSQL and DeepSeek LLM with adaptive difficulty",
    ],
    stack: ["UAT", "Functional testing", "React", "FastAPI", "PostgreSQL", "DeepSeek LLM", "Google OAuth"],
    github: "https://github.com/Enet-c/Core_engine",
    images: [
      "/projects/e-pretest/01-login.png",
      "/projects/e-pretest/02-subjects.png",
      "/projects/e-pretest/03-subject-detail.png",
      "/projects/e-pretest/04-quiz.png",
      "/projects/e-pretest/05-summary.png",
    ],
  },
  {
    slug: "chatops-network-automation",
    title: "AI-Driven ChatOps",
    icon: Bot,
    tagline: "Discord bot for Cisco network automation · solo course project",
    badges: ["Course Project", "Solo"],
    role: "Developer",
    date: "2025",
    summary:
      "Built a Discord bot that turns plain-language requests into Cisco router commands with Gemini AI, then runs them on real hardware in the university lab over GlobalProtect VPN — only after an admin approves, with an automatic config backup and audit log for every change.",
    bullets: [
      "Gemini AI turns chat requests into Cisco IOS commands",
      "Safe by design: role check, Y/N approval, auto-backup and audit log",
      "Runs on real lab routers over SSH (Netmiko) via GlobalProtect VPN",
    ],
    stack: ["Python", "Discord", "Gemini AI", "Netmiko", "Cisco IOS", "GlobalProtect VPN"],
    images: [
      "/projects/chatops-network-automation/003.png",
      "/projects/chatops-network-automation/004.png",
      "/projects/chatops-network-automation/005.png",
      "/projects/chatops-network-automation/001.png",
    ],
  },
  {
    slug: "dotnet-backend-api",
    title: ".NET Backend & API",
    icon: Server,
    tagline: "Industry backend workshop · 3 sessions",
    badges: ["Workshop"],
    role: "Participant",
    date: "2025",
    summary:
      "Built a user-management REST API in ASP.NET Core across a 3-session industry workshop, following the instructor step by step — with JWT login, refresh tokens and logout that revokes the session — then tested every endpoint in Postman and Swagger.",
    bullets: [
      "11 endpoints: register, login, refresh, logout, profile and full user CRUD",
      "JWT access + refresh tokens; logout revokes both instantly, passwords hashed with BCrypt",
      "Tested every endpoint in Postman with Bearer auth, documented with Swagger",
    ],
    stack: ["C#", "ASP.NET Core", "REST API", "JWT", "Postman", "Swagger"],
  },
  {
    slug: "image-classification-cnn",
    title: "Image Classification Model",
    icon: Brain,
    tagline: "Flower classifier CNN in MATLAB · coursework project",
    badges: ["Coursework"],
    role: "Developer",
    date: "2025",
    summary:
      "Trained a Convolutional Neural Network in MATLAB on ~10,900 images to recognise 11 kinds of flowers, reaching 90.61% validation accuracy, and built a desktop app that classifies any photo with a confidence score.",
    bullets: [
      "11 flower classes, ~10,900 training images",
      "90.61% validation accuracy after 8 epochs (5,568 iterations)",
      "MATLAB App Designer app: load a photo → flower type + confidence",
    ],
    stack: ["MATLAB", "Deep Learning Toolbox", "CNN", "App Designer"],
    github: "https://github.com/Chanonwc/flower-classification",
    images: ["/projects/classification/01-app.png", "/projects/classification/02-training.jpg"],
  },
  {
    slug: "i2c-io-expander",
    title: "I2C I/O Expander Board",
    icon: CircuitBoard,
    tagline: "Custom PCB with the PCF8574",
    badges: ["Hardware"],
    role: "Designer",
    date: "2025",
    summary:
      "Designed and prototyped a custom PCB using the PCF8574 IC for I2C-based I/O expansion, interfacing digital inputs and outputs.",
    bullets: [
      "Custom PCB design and prototype",
      "I2C-based I/O expansion with the PCF8574",
      "Interfaces digital inputs and outputs",
    ],
    stack: ["PCF8574", "I2C", "PCB design"],
  },
  {
    slug: "flutter-mobile-app",
    title: "KickOff",
    icon: Smartphone,
    tagline: "Football field booking app · Flutter + Firebase",
    badges: ["Developer"],
    role: "Developer",
    date: "2025",
    summary:
      "Built a cross-platform Flutter app for booking football fields: Firebase sign-in, live field list, bookings that block overlapping time slots, an admin view to confirm bookings and track revenue, a booking calendar and a team-merch store with cart.",
    bullets: [
      "Booking with price calculation and double-booking check",
      "Admin role: confirm pending bookings and see total revenue",
      "Firebase Auth, Firestore and Storage (profile photos), 13 screens",
    ],
    stack: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Firebase Storage"],
    github: "https://github.com/Chanonwc/Mobile-App-First-Time",
    images: ["/projects/app_kickoff/01-fields.png", "/projects/app_kickoff/02-profile.png"],
  },
  {
    slug: "linear-dc-power-supply",
    title: "Linear DC Power Supply",
    icon: Zap,
    tagline: "Hand-built, dual-rail ±12V and +5V",
    badges: ["Hardware"],
    role: "Builder",
    date: "2024",
    summary:
      "Assembled a fully functional linear DC power supply with adjustable dual-rail outputs (±12V) and a fixed +5V output, including hand-winding the main power transformer.",
    bullets: [
      "Adjustable dual-rail ±12V outputs",
      "Fixed +5V output",
      "Hand-wound main power transformer",
    ],
    stack: ["Analog electronics", "Power supply", "Transformer winding"],
  },
];

// Projects for the timeline, newest first — sorted by the first year in `date`
// ("Coming soon" / no year goes on top). Projects from the same year keep the order above.
const startYear = (date: string) => Number(date.match(/\d{4}/)?.[0] ?? 9999);
export const projectsByDate = [...projects].sort((a, b) => startYear(b.date) - startYear(a.date));

// Not shown on the page right now (the Thoughts section was dropped from the design).
// Kept here so it can be brought back later.
export const thoughts = [
  {
    title: "Finding holes in a CAD model",
    date: "Coming soon",
    summary: "Notes on reading STEP files and extracting holes analytically for 3D-ProbeCode.",
    tags: ["Python", "CAD"],
    href: "#",
  },
  {
    title: "Testing an AI pre-test platform",
    date: "Coming soon",
    summary: "Writing UAT scenarios and running functional tests for E-Pretest.",
    tags: ["UAT", "React"],
    href: "#",
  },
  {
    title: "Training a CNN in MATLAB",
    date: "Coming soon",
    summary: "Classifying 10 object classes and reaching 90.61% validation accuracy.",
    tags: ["MATLAB", "CNN"],
    href: "#",
  },
];

export const usesIntro =
  "From microcontroller boards to web apps, cloud and vision models: the technologies I use to build things end to end.";

// Skills shown in the scrolling logo rows of the Skill section — one inner list per row.
// Rows scroll in alternating directions.
export const skillRows = [
  // Languages, web & mobile
  ["Python", "C / C++", "Java", "JavaScript", "Dart", "React", "HTML", "CSS", "Node.js", "Flutter"],
  // Cloud & data, embedded, AI & vision
  ["Microsoft Azure", "Firebase", "MySQL", "ESP32", "Arduino", "STM32", "OpenCV", "YOLOv8", "MATLAB"],
];

// Logo for each skill — files live in /public/skills. Every skill in skillRows needs an entry here.
// Add a new skill: drop an SVG in public/skills and map the name to it.
export const skillLogos: Record<string, string> = {
  ESP32: "/skills/espressif.svg",
  Arduino: "/skills/arduino.svg",
  STM32: "/skills/stmicroelectronics.svg",
  "C / C++": "/skills/cplusplus.svg",
  Python: "/skills/python.svg",
  Java: "/skills/java.svg",
  Dart: "/skills/dart.svg",
  JavaScript: "/skills/javascript.svg",
  MySQL: "/skills/mysql.svg",
  React: "/skills/react.svg",
  HTML: "/skills/html5.svg",
  CSS: "/skills/css3.svg",
  "Node.js": "/skills/nodejs.svg",
  Flutter: "/skills/flutter.svg",
  Firebase: "/skills/firebase.svg",
  OpenCV: "/skills/opencv.svg",
  YOLOv8: "/skills/ultralytics.svg",
  MATLAB: "/skills/matlab.svg",
  "Microsoft Azure": "/skills/azure.svg",
};
