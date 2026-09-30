import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "../content";

// Regular cards only show the first few tech tags; the full list is on the detail page.
const MAX_TAGS = 4;

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

  const shownStack = featured ? project.stack : project.stack.slice(0, MAX_TAGS);
  const hiddenCount = project.stack.length - shownStack.length;
  const shownBadges = featured ? project.badges : project.badges.slice(0, 1);

  return (
    <article
      className={`card reveal flex flex-col gap-4 ${featured ? "md:col-span-2" : ""}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="icon-badge">
          <Icon size={20} />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {shownBadges.map((badge) => (
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

      <p className={`text-gray-600 dark:text-gray-400 ${featured ? "" : "line-clamp-4"}`}>
        {project.summary}
      </p>

      {featured && (
        <ul className="space-y-1.5 text-sm">
          {project.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="text-primary-500">✦</span>
              <span className="font-medium">{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5">
        {shownStack.map((tech) => (
          <span key={tech} className="pill">
            {tech}
          </span>
        ))}
        {hiddenCount > 0 && <span className="pill">+{hiddenCount}</span>}
      </div>

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
    </article>
  );
}
