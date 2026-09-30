"use client";

import { useEffect, useRef, useState } from "react";

// A page section that reveals itself the first time it scrolls into view.
export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
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
      <div className="mb-8 flex items-center gap-2 text-primary-500">
        <span className="font-bold">/{id}</span>
        <div className="section-line mx-1 flex-1 border-b border-primary-500" />
        <h2 className="reveal font-serif text-lg text-black md:text-4xl dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}
