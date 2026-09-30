import Image from "next/image";
import { AtSign, Github, Instagram, Linkedin } from "lucide-react";
import ContributionGraph from "./components/ContributionGraph";
import ProjectCard from "./components/ProjectCard";
import Section from "./components/Section";
import TopNav from "./components/TopNav";
import {
  githubUsername,
  profile,
  projects,
  socials,
  uses,
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
    { label: "Projects completed", value: String(projects.length) },
    { label: "Most used language", value: github?.topLanguage ?? "—" },
  ];

  return (
    <>
      <TopNav />

      <main className="relative z-10 w-full">
        {/* HOME */}
        <section id="home" className="relative min-h-svh font-serif">
          <div className="fade-in absolute top-[20%] flex max-w-5xl flex-col justify-center space-y-4 px-8 md:top-[40%] md:px-24 lg:ml-14">
            <h1 className="text-2xl md:mr-4 md:text-4xl">
              Welcome to my <span className="font-bold">personal portfolio — </span> a
              place where I <span className="border-b border-b-primary-500 italic">build</span>,
              break and learn things.
            </h1>

            <p className="text-justify text-base">
              I&apos;m {profile.name} — {profile.role}. {profile.intro} Right now, I&apos;m
              studying at{" "}
              <a
                href={profile.current.href}
                className="underline-magical"
                target="_blank"
                rel="noreferrer"
              >
                {profile.current.label}
              </a>
              .
            </p>

            <div className="text-sm">
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

        <div className="mx-auto w-full max-w-5xl border-x border-gray-200 dark:border-gray-300/20">
          {/* PROJECTS */}
          <Section id="projects" title="Projects">
            <p className="reveal text-lg leading-7 text-gray-500 dark:text-gray-400">
              Here are some of my selected projects worth sharing.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  featured={i === 0}
                  style={delay(i)}
                />
              ))}
            </div>
          </Section>

          {/* SKILL */}
          <Section id="skill" title="Skill">
            <p className="reveal text-lg leading-7 text-gray-500 dark:text-gray-400">
              {usesIntro}
            </p>
            <div className="grid gap-6 md:grid-cols-5">
              {uses.map((group, i) => (
                <div
                  key={group.title}
                  className={`card reveal flex flex-col gap-3 ${
                    i % 4 === 0 || i % 4 === 3 ? "md:col-span-3" : "md:col-span-2"
                  } ${i % 4 === 1 ? "card-tinted" : ""}`}
                  style={delay(i)}
                >
                  <span className="icon-badge rounded-full!">
                    <group.icon size={18} />
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{group.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-black dark:text-white">{group.lead}</span>{" "}
                    {group.text}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {group.tags.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* STATS */}
          <Section id="stats" title="Stats">
            <p className="reveal mb-5 text-lg leading-7 text-gray-500 dark:text-gray-400">
              Here are some personal stats gathered from different sources.
            </p>

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
                    className="rounded-md border-b border-gray-200 px-3 py-2 dark:border-gray-800"
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
    </>
  );
}
