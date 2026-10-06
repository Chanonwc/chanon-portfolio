import { ExternalLink, Github } from "lucide-react";
import type { Project } from "../content";
import ProjectPreview from "./ProjectPreview";

// Vertical timeline of projects: icon on the line, then date, title, tagline, summary and link buttons.
export default function ProjectTimeline({ projects }: { projects: Project[] }) {
  return (
    <ol className="relative ml-5 border-l border-[var(--line)] dark:border-gray-300/20">
      {projects.map((project, i) => {
        const Icon = project.icon;
        const links = [
          ...(project.github ? [{ label: "GitHub", href: project.github, github: true }] : []),
          ...(project.links ?? []).map((link) => ({ ...link, github: false })),
        ];

        return (
          <li
            key={project.slug}
            className="group reveal relative pb-10 pl-10 last:pb-0"
            style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
          >
            <ProjectPreview
              title={project.title}
              images={project.images}
              points={project.bullets}
              stack={project.stack}
              fallback={<Icon size={56} strokeWidth={1.25} />}
            />

            <span className="timeline-dot">
              <Icon size={16} />
            </span>

            <time className="text-xs text-gray-500 dark:text-gray-400">{project.date}</time>
            <h3 className="mt-0.5 font-serif text-xl font-bold transition-colors group-hover:text-primary-500">{project.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{project.tagline}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              {project.summary}
            </p>

            {links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skill-chip text-xs!"
                  >
                    {link.github ? <Github size={14} /> : <ExternalLink size={14} />}
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
