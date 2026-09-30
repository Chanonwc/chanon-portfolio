// All content for the site lives here — edit this file to update the pages.

import {
  ClipboardCheck,
  Code,
  Cpu,
  Crosshair,
  Fan,
  FileUp,
  GraduationCap,
  type LucideIcon,
  MonitorSmartphone,
  Route,
  SlidersHorizontal,
  Smartphone,
  Target,
  Users,
} from "lucide-react";

export const profile = {
  name: "Chanon Wichai",
  role: "an Electronic & Computer Engineering student",
  intro:
    "I enjoy turning ideas into practical projects across software, embedded systems, IoT and AI, and I learn new technologies by building things myself.",
  current: { label: "KMUTNB", href: "https://www.kmutnb.ac.th/" },
};

export const socials = {
  github: "https://github.com/Chanonwc",
  linkedin: "#",
  instagram: "#",
  email: "mailto:your-email@example.com",
};

// Sections of the single page, in order — also drives the top navigation.
export const sections = [
  { id: "projects", title: "Projects" },
  { id: "thoughts", title: "Thoughts" },
  { id: "uses", title: "Uses" },
  { id: "stats", title: "Stats" },
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
  // Everything below is optional and only shown on the project's detail page.
  description?: string;
  detailStack?: string[];
  github?: string;
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
    tagline: "Capstone project · CNC / CMM probe path planner",
    badges: ["Capstone", "Project Leader"],
    role: "Project Leader",
    date: "Apr – Sep 2026",
    summary:
      "A desktop tool that reads STEP/STP CAD models, detects holes automatically, plans a probing path for each hole and exports a ready-to-run GRBL G-code program for our self-built CNC probing machine.",
    bullets: [
      "Analytic hole extraction from STEP B-Rep (incl. counterbores)",
      "6-view depth map, 3D path preview and probe reach checks",
      "Nearest-neighbour routing and G38.2 G-code export",
    ],
    stack: ["Python", "CustomTkinter", "CadQuery / OpenCascade", "trimesh", "NumPy"],
    description:
      "Our final-year project: a CNC machine fitted with a touch probe, and the software that tells it where to measure. You load a CAD model of a mould or part, the app finds every hole that needs inspecting, and it writes a G-code program that probes each hole's walls layer by layer. After the job runs, the machine's log comes back into the app to compare what was measured against what the CAD model expects.",
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
    stats: [
      { value: "120", label: "Commits" },
      { value: "54", label: "Pull requests merged" },
      { value: "7.6k", label: "Lines of Python" },
      { value: "3", label: "Contributors" },
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
    tagline: "AI pre-test platform for KMUTNB students",
    badges: ["Project Manager"],
    role: "Project Manager",
    date: "Mar 2026",
    summary:
      "Led a 5-person team building a platform that turns lecture PDFs into multiple-choice pre-tests with an LLM, adapts difficulty to each student and runs a GAP analysis after every exam.",
    bullets: [
      "Planned the timeline and coordinated the team",
      "Bayesian adaptive difficulty across 5 levels",
      "KMUTNB-only Google OAuth sign-in",
    ],
    stack: ["React 18", "Vite", "FastAPI", "PostgreSQL", "MongoDB"],
  },
  {
    slug: "stm32-smart-fan",
    title: "STM32 Smart Fan",
    icon: Fan,
    tagline: "Temperature-controlled fan on a Blue Pill",
    badges: ["Developer"],
    role: "Developer",
    date: "Jul 2026",
    summary:
      "Reads temperature and humidity from a DHT22 every 2 seconds and drives a fan through a motor driver with PWM, mapping 35–50 °C to fan speed with smooth ramping instead of sudden jumps.",
    bullets: [
      "Linear temperature → PWM speed curve",
      "Soft ramp in steps of 5 for quiet transitions",
      "Serial logging of humidity, temperature and fan PWM",
    ],
    stack: ["C / C++", "Arduino (STM32duino)", "STM32F103C8T6", "DHT22", "PWM"],
  },
  {
    slug: "otakubox",
    title: "OtakuBox",
    icon: Smartphone,
    tagline: "Flutter anime browser (Mobile-GakGak)",
    badges: ["Solo Developer"],
    role: "Solo Developer",
    date: "Dec 2025 – Feb 2026",
    summary:
      "A Flutter mobile app for browsing anime, built for the Year 3 Mobile Application course, with a Firebase backend and Google Sign-In.",
    bullets: [
      "Designed and built end to end, solo",
      "Firebase Auth with Google Sign-In",
      "Live anime data from the Jikan API",
    ],
    stack: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Google Sign-In"],
  },
];

export const thoughts = [
  {
    title: "Finding holes in a CAD model",
    date: "Coming soon",
    summary: "Notes on reading STEP files and extracting holes analytically for 3D-ProbeCode.",
    tags: ["Python", "CAD"],
    href: "#",
  },
  {
    title: "Adaptive difficulty for pre-tests",
    date: "Coming soon",
    summary: "How E-Pretest picks the next question level for each student.",
    tags: ["LLM", "FastAPI"],
    href: "#",
  },
  {
    title: "Smooth fan control on a Blue Pill",
    date: "Coming soon",
    summary: "Mapping temperature to PWM and ramping the speed without sudden jumps.",
    tags: ["STM32", "PWM"],
    href: "#",
  },
];

export const usesIntro =
  "From firmware on a Blue Pill to full-stack web apps: the tools I reach for when building things end to end.";

export const uses = [
  {
    title: "Embedded & IoT",
    icon: Cpu,
    lead: "Hardware that reacts.",
    text: "Microcontroller projects on STM32, ESP32 and Arduino: reading sensors, driving motors with PWM and wiring it all up on real boards.",
    tags: ["STM32", "ESP32", "Arduino", "C / C++"],
  },
  {
    title: "Programming",
    icon: Code,
    lead: "The fundamentals.",
    text: "Comfortable across several languages, from scripting tools in Python to object-oriented work in Java and C#.",
    tags: ["Python", "Java", "C#", "SQL"],
  },
  {
    title: "Web & Mobile",
    icon: MonitorSmartphone,
    lead: "Screens people use.",
    text: "Front-ends in React and plain HTML/CSS/JS, and cross-platform mobile apps in Flutter with Firebase.",
    tags: ["React", "HTML", "CSS", "JavaScript", "Flutter", "Firebase"],
  },
  {
    title: "Project Management",
    icon: Users,
    lead: "Keeping teams on track.",
    text: "Led the 5-person E-Pretest team as project manager and the 3D-ProbeCode capstone as project leader: planning timelines, splitting work and tracking progress.",
    tags: ["Planning", "Teamwork", "Time management"],
  },
];

export const stats = [
  { label: "Public repositories", value: "—" },
  { label: "Contributions this year", value: "—" },
  { label: "Projects completed", value: "—" },
  { label: "Most used language", value: "—" },
];
