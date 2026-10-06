"use client";

import { useEffect, useRef, useState } from "react";

// A page section that reveals itself the first time it scrolls into view.
export default function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  // Small pill above the heading.
  label: string;
  title: string;
  // Optional centered paragraph under the heading.
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`flex scroll-mt-12 flex-col gap-4 px-8 py-20 md:px-18 ${visible ? "is-visible" : ""}`}
    >
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <span className="section-label reveal">{label}</span>
        <h2 className="reveal text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
        {intro && (
          <p className="reveal max-w-2xl text-lg leading-7 text-gray-500 dark:text-gray-400">
            {intro}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
