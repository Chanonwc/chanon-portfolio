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
    <header className="nav-bar fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-5 font-serif text-base backdrop-blur-md md:h-[72px] md:px-12">
      <a href="#home" className="hidden text-lg font-bold md:text-xl sm:block">
        Chanon Wichai
      </a>
      <div className="flex flex-1 items-center justify-between gap-3 sm:flex-none sm:justify-end sm:gap-8">
        <nav className="flex gap-5 sm:gap-8">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={`relative py-1 transition-colors hover:text-primary-500 ${
                active === id ? "text-gradient" : ""
              }`}
            >
              {label}
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-[image:var(--grad)] transition-transform duration-300 ${
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
