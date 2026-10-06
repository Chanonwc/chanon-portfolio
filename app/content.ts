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
      "A CMM (Coordinate Measuring Machine) path planner in Python that parses STEP files, detects holes automatically, plans a probing path for each hole and evaluates measurement accuracy.",
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
    images: ["/projects/3d-probecode/photo-1.jpg"],
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
    tagline: "AI pre-test generator platform",
    badges: ["Software Tester"],
    role: "Software Tester",
    date: "2025",
    summary:
      "Designed UAT scenarios and conducted hands-on functional testing for an AI pre-test generator platform to ensure a seamless user experience.",
    bullets: [
      "Designed UAT scenarios for the platform",
      "Hands-on functional testing of the user flows",
      "Platform built with React, DeepSeek LLM and Google OAuth",
    ],
    stack: ["React", "DeepSeek LLM", "Google OAuth", "UAT"],
  },
  {
    slug: "chatops-network-automation",
    title: "AI-Driven ChatOps",
    icon: Bot,
    tagline: "Network automation bot · course project",
    badges: ["Course Project"],
    role: "Developer",
    date: "2025",
    summary:
      "Developed an AI-driven ChatOps bot as a course project to automate Cisco network configurations via secure GlobalProtect VPN connections to university servers.",
    bullets: [
      "Automates Cisco network configuration from chat",
      "Python with Netmiko and Google GenAI",
      "Secure access through GlobalProtect VPN",
    ],
    stack: ["Python", "Netmiko", "Google GenAI", "Cisco", "GlobalProtect VPN"],
  },
  {
    slug: "dotnet-backend-api",
    title: ".NET Backend & API",
    icon: Server,
    tagline: "Technical workshop by Tokio Marine",
    badges: ["Workshop"],
    role: "Participant",
    date: "2025",
    summary:
      "Took part in a technical workshop by Tokio Marine covering backend development across 3 specialised sessions, testing endpoints and validating inputs to keep APIs secure.",
    bullets: [
      "RESTful API design",
      "JWT authentication and CORS configuration",
      "Tested endpoints with Postman and Swagger",
    ],
    stack: [".NET", "REST API", "JWT", "CORS", "Postman", "Swagger"],
  },
  {
    slug: "image-classification-cnn",
    title: "Image Classification Model",
    icon: Brain,
    tagline: "CNN in MATLAB · coursework project",
    badges: ["Coursework"],
    role: "Developer",
    date: "2025",
    summary:
      "Developed and trained a Convolutional Neural Network in MATLAB to classify 10 distinct object classes, reaching a validation accuracy of 90.61%.",
    bullets: [
      "Classifies 10 object classes",
      "Trained and validated a CNN in MATLAB",
      "90.61% validation accuracy",
    ],
    stack: ["MATLAB", "CNN"],
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
    title: "Cross-Platform Mobile App",
    icon: Smartphone,
    tagline: "Flutter app with Firebase authentication",
    badges: ["Developer"],
    role: "Developer",
    date: "2025",
    summary:
      "Built a cross-platform Flutter app and integrated Firebase to implement secure user authentication (login / sign-up) and manage user sessions across the application.",
    bullets: [
      "Login and sign-up with Firebase Authentication",
      "User sessions managed across the app",
      "Cross-platform with Flutter",
    ],
    stack: ["Flutter", "Dart", "Firebase"],
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
