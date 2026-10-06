import Image from "next/image";
import { ArrowUpRight, AtSign, Github, Instagram, Linkedin } from "lucide-react";
import ContactWidget from "./components/ContactWidget";
import ContributionGraph from "./components/ContributionGraph";
import ProjectTimeline from "./components/ProjectTimeline";
import Section from "./components/Section";
import SkillMarquee from "./components/SkillMarquee";
import TopNav from "./components/TopNav";
import {
  githubUsername,
  profile,
  projectsByDate,
  skillLogos,
  skillRows,
  socials,
  usesIntro,
} from "./content";
import { getGithubStats } from "./lib/github";

// Re-fetch the GitHub numbers at most once an hour.
export const revalidate = 3600;

const socialLinks = [
  { label: "linkedin", href: socials.linkedin, icon: Linkedin },
  { label: "github", href: socials.github, icon: Github },
  { label: "instagram", href: socials.instagram, icon: Instagram },
  { label: "email", href: socials.email, icon: AtSign },
];

const skeleton = "animate-pulse rounded-md bg-gray-100 dark:bg-gray-900";

// Staggers the reveal of list items inside a section.
const delay = (i: number) => ({ transitionDelay: `${150 + i * 90}ms` });

export default async function Home() {
  const github = await getGithubStats(githubUsername);

  const overview = [
    {
      label: "Public repositories",
      value: github?.publicRepos != null ? String(github.publicRepos) : "—",
    },
    {
      label: "Contributions this year",
      value: github?.days.length ? github.totalContributions.toLocaleString("en-US") : "—",
    },
    { label: "Projects completed", value: String(projectsByDate.length) },
    { label: "Most used language", value: github?.topLanguage ?? "—" },
  ];

  return (
    <>
      <TopNav />

      <main className="relative z-10 w-full">
        {/* HOME */}
        <section id="home" className="relative min-h-svh font-serif">
          <div className="absolute top-[18%] flex max-w-5xl flex-col justify-center space-y-4 px-8 md:top-[34%] md:px-24 lg:ml-14">
            <h1 className="fade-in text-2xl md:mr-4 md:text-4xl" style={{ animationDelay: "120ms" }}>
              Welcome to my <span className="font-bold">personal portfolio — </span> a
              place where I{" "}
              <span className="italic">build</span>, break and learn things.
            </h1>

            <p className="fade-in text-justify text-base" style={{ animationDelay: "260ms" }}>
              I&apos;m {profile.name} — {profile.role}. {profile.intro} Right now, I&apos;m
              studying at{" "}
              <a
                href={profile.current.href}
                className="link-fancy"
                target="_blank"
                rel="noreferrer"
              >
                {profile.current.label}
                <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden />
              </a>
              .
            </p>

            <div className="fade-in text-sm" style={{ animationDelay: "400ms" }}>
              <p>More about me:</p>
              <div className="-ml-2 flex">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="icon-btn"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Photo: floats on the right, outside the text flow, so it never squeezes the text.
              Only shown on wide screens where there is free space next to the text. */}
          <div
            className="fade-in absolute right-12 top-[28%] hidden min-[1300px]:block 2xl:right-24"
            style={{ animationDelay: "150ms" }}
          >
            <div className="photo-frame relative aspect-[4/5] w-56 2xl:w-64">
              <Image
                src={profile.photo}
                alt={profile.name}
                fill
                priority
                sizes="(min-width: 1536px) 256px, 224px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl">
          {/* PROJECTS */}
          <Section
            id="projects"
            label="Projects"
            title="I like building things"
            intro="From capstone work to coursework and workshops, here is what I've built — newest first."
          >
            <ProjectTimeline projects={projectsByDate} />
          </Section>

          {/* SKILL */}
          <Section id="skill" label="Skills" title="My tech stack" intro={usesIntro}>
            <SkillMarquee
              label="Languages, frameworks, hardware and cloud I build with"
              rows={skillRows}
              logos={skillLogos}
            />
          </Section>

          {/* STATS */}
          <Section
            id="stats"
            label="Stats"
            title="By the numbers"
            intro="Here are some personal stats gathered from different sources."
          >

            <div className="reveal space-y-4" style={delay(0)}>
              <div>
                <h3 className="text-2xl font-extrabold leading-9 tracking-tight">Github</h3>
                <p className="leading-4 text-gray-500 dark:text-gray-400">Contributions Stats</p>
              </div>
              {github && github.days.length > 0 ? (
                <ContributionGraph days={github.days} total={github.totalContributions} />
              ) : (
                // Shown only when GitHub couldn't be reached (rate limit / offline).
                <div className="flex h-[152px] flex-col justify-between">
                  <div className={`${skeleton} h-4 w-full`} />
                  <div className={`${skeleton} h-[102px] w-full`} />
                  <div className={`${skeleton} h-4 w-36`} />
                </div>
              )}
            </div>

            <div className="reveal mt-7 space-y-4" style={delay(1)}>
              <div>
                <h3 className="text-2xl font-extrabold leading-9 tracking-tight">Overview</h3>
                <p className="leading-4 text-gray-500 dark:text-gray-400">Coding Stats</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {overview.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border-b border-[var(--line)] px-3 py-2 dark:border-gray-800"
                  >
                    <p className="font-bold">{stat.label}</p>
                    <span className="text-gray-500 dark:text-gray-400">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <footer className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
          © 2026 {profile.name}
        </footer>
      </main>
      <ContactWidget />
    </>
  );
}
