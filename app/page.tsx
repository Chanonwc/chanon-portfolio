import {
  ArrowUpRight,
  Cpu,
  Database,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  BrainCircuit,
  Code2,
  ExternalLink,
  Server,
  Smartphone,
} from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Smart Measurement System",
    description:
      "Low-cost dimensional inspection concept using camera, CNC motion and computer vision.",
    tags: ["Python", "OpenCV", "CNC", "Computer Vision"],
    icon: Cpu,
  },
  {
    number: "02",
    title: "ESP32 IoT Monitoring",
    description:
      "Real-time sensor monitoring system using ESP32, MQTT and Node-RED.",
    tags: ["ESP32", "Arduino", "MQTT", "Node-RED"],
    icon: Server,
  },
  {
    number: "03",
    title: "AI Fruit Classification",
    description:
      "Image classification application using a trained deep learning model.",
    tags: ["MATLAB", "CNN", "Deep Learning"],
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Webboard System",
    description:
      "Web-based discussion platform with authentication and MySQL database.",
    tags: ["PHP", "MySQL", "Bootstrap"],
    icon: Database,
  },
];

const skillGroups = [
  {
    title: "Programming",
    icon: Code2,
    skills: ["C#", "Java", "Python", "PHP", "SQL", "C/C++", "JavaScript", "TypeScript"],
  },
  {
    title: "AI / Data",
    icon: BrainCircuit,
    skills: ["MATLAB", "Deep Learning", "CNN", "Computer Vision", "Image Processing"],
  },
  {
    title: "Embedded / IoT",
    icon: Cpu,
    skills: ["Arduino", "ESP32", "MQTT", "Node-RED", "Sensors", "LCD"],
  },
  {
    title: "Tools",
    icon: Smartphone,
    skills: ["Git", "GitHub", "VS Code", "MySQL", "Docker", "MATLAB"],
  },
];

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="section-label mb-3">{label}</p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-blue-400/20 bg-blue-400/5 px-2.5 py-1 text-xs text-slate-300">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#06111f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <a href="#home" className="font-bold tracking-tight">
            <span className="text-blue-400">C</span>W
          </a>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            {["About", "Projects", "Skills", "Education", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden rounded-full border border-blue-400/60 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-400/10 md:block"
          >
            Contact
          </a>

          <button
            aria-label="Open menu"
            className="rounded-lg border border-white/10 p-2 text-slate-200 md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="grid-bg relative flex min-h-screen items-center pt-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[.2em] text-blue-400">
              ELECTRONIC & COMPUTER ENGINEERING
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[.95] tracking-tight sm:text-7xl">
              Hi, I&apos;m{" "}
              <span className="text-gradient">Chanon Wichai</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              I build software, embedded systems, IoT applications and intelligent
              solutions through hands-on engineering projects.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                View My Projects <ArrowUpRight size={17} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Contact Me
              </a>
            </div>

            <div className="mt-9 flex gap-4 text-slate-400">
              <a href="#" aria-label="GitHub" className="transition hover:text-white"><Github /></a>
              <a href="#" aria-label="LinkedIn" className="transition hover:text-white"><Linkedin /></a>
              <a href="#" aria-label="Instagram" className="transition hover:text-white"><Instagram /></a>
              <a href="mailto:your-email@example.com" aria-label="Email" className="transition hover:text-white"><Mail /></a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="glow float relative aspect-[4/5] overflow-hidden rounded-3xl border border-blue-300/15 bg-gradient-to-br from-blue-500/15 via-slate-900 to-cyan-500/10">
              <div className="absolute inset-0 grid-bg opacity-60" />
              <div className="absolute left-7 top-7 rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
                <p className="text-xs text-slate-400">SYSTEM STATUS</p>
                <p className="mt-1 text-sm font-semibold text-cyan-300">Building better systems</p>
              </div>

              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm text-slate-300">Available for opportunities</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <span>Software ✓</span>
                  <span>IoT ✓</span>
                  <span>AI / ML ✓</span>
                  <span>Embedded ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
          <SectionTitle label="About me" title="Engineering with a practical mindset." />

          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="card rounded-3xl p-7 sm:p-9">
              <p className="text-lg leading-8 text-slate-300">
                I&apos;m Chanon, an Electronic & Computer Engineering student/graduate
                focused on software development, embedded systems, IoT and AI.
              </p>
              <p className="mt-5 leading-7 text-slate-400">
                I enjoy turning ideas into practical projects and learning new
                technologies by building things myself.
              </p>
            </div>

            <div className="card rounded-3xl p-7">
              <div className="flex gap-4 border-b border-white/5 pb-5">
                <MapPin className="mt-1 text-blue-400" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="mt-1 text-sm text-slate-200">Bangkok, Thailand</p>
                </div>
              </div>
              <div className="flex gap-4 border-b border-white/5 py-5">
                <GraduationCap className="mt-1 text-cyan-400" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Education</p>
                  <p className="mt-1 text-sm text-slate-200">
                    KMUTNB · Electronic & Computer Engineering
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-5">
                <Code2 className="mt-1 text-blue-400" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Focus</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Software · IoT · AI · Embedded Systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="border-t border-white/5 bg-white/[.015]">
        <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <SectionTitle label="Featured projects" title="Things I&apos;ve built." />
            <a href="#" className="mb-10 hidden items-center gap-1 text-sm text-blue-400 sm:flex">
              View all <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <article
                  key={project.number}
                  className="card group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/35"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[.2em] text-blue-400">
                      {project.number}
                    </span>
                    <div className="rounded-xl border border-white/10 p-3 text-cyan-300">
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="mt-3 min-h-14 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                  </div>

                  <button className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition group-hover:text-blue-300">
                    View details <ExternalLink size={15} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
          <SectionTitle label="Skills" title="Technologies I work with." />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skillGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.title} className="card rounded-3xl p-6">
                  <div className="mb-5 inline-flex rounded-xl border border-blue-400/20 bg-blue-400/5 p-3 text-blue-300">
                    <Icon size={21} />
                  </div>
                  <h3 className="font-bold">{group.title}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="border-t border-white/5 bg-white/[.015]">
        <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
          <SectionTitle label="Education" title="My journey so far." />

          <div className="relative ml-3 border-l border-blue-400/20 pl-8">
            {[
              ["2022", "KMUTNB", "Electronic & Computer Engineering"],
              ["2024", "Projects & Learning", "AI / ML, IoT and Embedded Systems"],
              ["2026", "Portfolio", "Software Development & Web"],
            ].map(([year, title, detail]) => (
              <div key={year} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-[#06111f] bg-blue-400" />
                <p className="text-xs font-bold tracking-widest text-blue-400">{year}</p>
                <h3 className="mt-2 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
          <div className="card glow rounded-[2rem] p-8 sm:p-12">
            <p className="section-label mb-3">Let&apos;s connect</p>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                  Have a project or opportunity?
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-slate-400">
                  Feel free to reach out. I&apos;m always interested in building
                  useful things and learning something new.
                </p>
              </div>

              <a
                href="mailto:your-email@example.com"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
              >
                Send Email <Mail size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 Chanon Wichai</span>
          <span>Built with Next.js · TypeScript · Tailwind CSS</span>
        </div>
      </footer>
    </main>
  );
}