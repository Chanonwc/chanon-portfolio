import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { projects } from "../../content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} | Chanon Wichai` : "Chanon Wichai" };
}

const delay = (i: number) => ({ animationDelay: `${i * 100}ms` });

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const Icon = project.icon;

  const githubButton = project.github && (
    <a href={project.github} target="_blank" rel="noreferrer" className="btn-primary w-fit">
      <Github size={15} /> View on GitHub <ArrowUpRight size={15} />
    </a>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white/60 px-4 py-2 font-serif text-sm backdrop-blur-sm md:px-8 dark:bg-black/60">
        <Link href="/#projects" className="flex items-center gap-1.5 font-bold hover:text-primary-500">
          <ArrowLeft size={16} /> All projects
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-12 border-x border-gray-200 px-8 pb-16 pt-24 md:px-18 dark:border-gray-300/20">
        {/* OVERVIEW */}
        <section className="fade-in grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="flex flex-col gap-4">
            <span className="icon-badge">
              <Icon size={20} />
            </span>
            <div>
              <h1 className="font-serif text-4xl font-bold md:text-6xl">{project.title}</h1>
              <p className="mt-2 font-serif italic text-primary-500">{project.tagline}</p>
            </div>
            <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
              {project.description ?? project.summary}
            </p>
            {githubButton}
          </div>

          <aside className="card flex h-fit flex-col gap-4">
            <div>
              <p className="label">Role</p>
              <p className="font-serif text-lg font-bold">{project.role}</p>
            </div>
            <div>
              <p className="label">Built</p>
              <p className="font-serif text-lg font-bold">{project.date}</p>
            </div>
            <div>
              <p className="label mb-1.5">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {(project.detailStack ?? project.stack).map((tech) => (
                  <span key={tech} className="pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {project.github && (
              <div>
                <p className="label">Source</p>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-sm font-bold hover:text-primary-500"
                >
                  {project.github.replace("https://", "")}
                </a>
              </div>
            )}
          </aside>
        </section>

        {project.stats && (
          <section className="fade-in grid grid-cols-2 gap-4 md:grid-cols-4" style={delay(1)}>
            {project.stats.map((stat) => (
              <div key={stat.label} className="card card-tinted p-4!">
                <p className="font-serif text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </section>
        )}

        {project.steps && (
          <section className="fade-in" style={delay(2)}>
            <h2 className="mb-6 font-serif text-2xl font-bold md:text-3xl">How it works</h2>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {project.steps.map((step, i) => (
                <div key={step.title} className="card relative p-5!">
                  <span className="absolute -left-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <step.icon size={20} className="text-primary-500" />
                  <h3 className="mt-3 font-serif font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="fade-in" style={delay(3)}>
          <h2 className="mb-6 font-serif text-2xl font-bold md:text-3xl">Highlights</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(project.highlights ?? project.bullets.map((text) => ({ title: "", text }))).map(
              (item) => (
                <div
                  key={item.text}
                  className="border-l-2 border-primary-500 bg-gray-100/70 px-4 py-3 dark:bg-white/[0.04]"
                >
                  {item.title && <h3 className="font-serif font-bold">{item.title}</h3>}
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                </div>
              ),
            )}
          </div>
        </section>

        <footer className="mt-auto flex items-end justify-between gap-6 border-t border-gray-200 pt-8 dark:border-gray-300/20">
          <div>{githubButton}</div>
          <Link href={`/projects/${next.slug}`} className="group ml-auto text-right">
            <p className="label">Next project</p>
            <p className="flex items-center gap-2 font-serif text-xl font-bold group-hover:text-primary-500">
              {next.title} <ArrowRight size={18} />
            </p>
          </Link>
        </footer>
      </main>
    </>
  );
}
