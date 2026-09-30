import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "../content";

export default function ProjectCard({
  project,
  featured = false,
  style,
}: {
  project: Project;
  featured?: boolean;
  style?: React.CSSProperties;
}) {
  const Icon = project.icon;

  const details = (
    <>
      <ul className="space-y-1.5 text-sm">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="text-primary-500">✦</span>
            <span className="font-medium">{bullet}</span>
          </li>
        ))}
      </ul>
      <div>
        <p className="label mb-1.5">Tech stack</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span key={tech} className="pill">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <article
      className={`card reveal flex flex-col gap-4 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-[3fr_2fr] md:gap-8" : ""
      }`}
      style={style}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="icon-badge">
            <Icon size={20} />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.badges.map((badge) => (
              <span key={badge} className="badge">
                {badge}
              </span>
            ))}
            <span className="pill">{project.date}</span>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-2xl font-bold">{project.title}</h3>
          <p className="font-serif text-sm italic text-primary-500">{project.tagline}</p>
        </div>

        <p className="text-gray-600 dark:text-gray-400">{project.summary}</p>

        {!featured && details}

        <div className="mt-auto flex items-center gap-4 pt-2">
          <Link href={`/projects/${project.slug}`} className="btn-primary">
            View project <ArrowRight size={15} />
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="underline-magical inline-flex items-center gap-1 text-sm font-bold"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>

      {featured && <div className="flex flex-col gap-4">{details}</div>}
    </article>
  );
}
