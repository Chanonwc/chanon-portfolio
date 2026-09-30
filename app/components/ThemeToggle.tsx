"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button type="button" aria-label="Toggle Dark Mode" onClick={toggle} className="icon-btn">
      <Sun size={20} className="hidden dark:block" />
      <Moon size={20} className="dark:hidden" />
    </button>
  );
}
