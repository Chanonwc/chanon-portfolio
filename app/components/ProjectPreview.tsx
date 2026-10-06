"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SLIDE_MS = 2500;
const CARD_W = 300;
const OFFSET = 24; // gap between cursor and card

// Floating card that follows the cursor while its parent timeline item is hovered:
// a photo (auto-swapping when there are several), a few key points and the tech tags.
// Mouse-only — touch screens don't get it. Rendered in a portal so page transforms don't offset it.
export default function ProjectPreview({
  title,
  images = [],
  points,
  stack,
  fallback,
}: {
  title: string;
  images?: string[];
  points: string[];
  stack: string[];
  // Shown instead of a photo when the project has none (the project icon).
  fallback: React.ReactNode;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => setMounted(true), []);

  // Hover + cursor tracking on the parent <li>, with a little easing so the card glides.
  useEffect(() => {
    const item = anchorRef.current?.closest("li");
    if (!item || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;

    const place = (x: number, y: number) => {
      const card = cardRef.current;
      if (!card) return;
      const h = card.offsetHeight;
      // Flip to the left of the cursor near the right edge; keep inside the viewport vertically.
      const left = x + OFFSET + CARD_W > window.innerWidth ? x - OFFSET - CARD_W : x + OFFSET;
      const top = Math.min(Math.max(y - h / 2, 80), window.innerHeight - h - 16);
      card.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      place(pos.x, pos.y);
      frame = requestAnimationFrame(tick);
    };

    const onEnter = (e: MouseEvent) => {
      target.x = pos.x = e.clientX;
      target.y = pos.y = e.clientY;
      place(pos.x, pos.y);
      setSlide(0);
      setActive(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onLeave = () => {
      setActive(false);
      cancelAnimationFrame(frame);
    };

    item.addEventListener("mouseenter", onEnter);
    item.addEventListener("mousemove", onMove);
    item.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      item.removeEventListener("mouseenter", onEnter);
      item.removeEventListener("mousemove", onMove);
      item.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Auto-swap photos while the card is showing.
  useEffect(() => {
    if (!active || images.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [active, images.length]);

  return (
    <>
      <span ref={anchorRef} hidden />
      {mounted &&
        createPortal(
          <div
            ref={cardRef}
            aria-hidden
            className={`preview-card ${active ? "is-active" : ""}`}
            style={{ width: CARD_W }}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-500/25 via-violet-500/15 to-cyan-500/20">
              {images.length > 0 ? (
                images.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={i === 0 ? title : ""}
                    fill
                    sizes={`${CARD_W}px`}
                    loading="eager"
                    className={`object-cover object-top transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
                  />
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-primary-500">{fallback}</div>
              )}
              {images.length > 1 && (
                <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                  {images.map((src, i) => (
                    <span
                      key={src}
                      className={`h-1.5 rounded-full bg-white shadow transition-all duration-300 ${
                        i === slide ? "w-4 opacity-100" : "w-1.5 opacity-60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <ul className="space-y-1.5 text-[13px] leading-5 text-gray-600 dark:text-gray-300">
                {points.slice(0, 3).map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {stack.slice(0, 5).map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
