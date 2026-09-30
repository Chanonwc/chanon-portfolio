"use client";

import { useEffect, useState } from "react";
import { sections } from "../content";
import ThemeToggle from "./ThemeToggle";

export default function TopNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    // A section counts as active while it crosses the middle of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white/60 px-4 py-2 font-serif text-sm backdrop-blur-sm md:px-8 dark:bg-black/60">
      <a href="#home" className="hidden font-bold sm:block">
        Chanon Wichai
      </a>
      <div className="flex flex-1 items-center justify-between gap-3 sm:flex-none sm:justify-end sm:gap-5">
        <nav className="flex gap-3 sm:gap-5">
          {sections.map(({ id }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={`relative py-1 transition-colors hover:text-primary-500 ${
                active === id ? "text-primary-500" : ""
              }`}
            >
              /{id}
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary-500 transition-transform duration-300 ${
                  active === id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
