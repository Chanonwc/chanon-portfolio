"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "Welcome";
const APPEAR_MS = 300; // word fades in
const HOLD_MS = 200; // pause before it starts to vaporise
const VAPOUR_MS = 1400; // the word dissolves from left to right over this time
const MAX_WAIT_MS = 5000; // start vaporising by now even if the page is still loading
const EXIT_MS = 800; // must match the .preloader slide-up transition
const SEEN_KEY = "intro-seen"; // also read by the inline script in layout.tsx

// Theme colours the particles drift towards as they vaporise.
const TINTS: [number, number, number][] = [
  [47, 125, 246],
  [139, 92, 246],
  [6, 182, 212],
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  delay: number; // 0..1, when (as a fraction of the vapour phase) this particle lets go
  tint: [number, number, number];
};

// Full-screen intro shown while the page loads: "Welcome" fades in, then turns to vapour,
// then the cover slides up. Plays once per browser session (SEEN_KEY in sessionStorage);
// the inline script in the layout reads the same key and either marks the page
// `is-loading` (holds back the hero animations and scrolling) or `intro-seen` (hides this).
export default function Preloader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      setGone(true);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelled = false;
    let frame = 0;
    const timers: number[] = [];
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const dark = document.documentElement.classList.contains("dark");
    const ink: [number, number, number] = dark ? [255, 255, 255] : [11, 11, 15];
    const serif = getComputedStyle(document.documentElement).getPropertyValue("--font-merriweather").trim();
    const fontSize = Math.min(w * 0.16, 140);
    const font = `700 ${fontSize}px ${serif || "Georgia"}, serif`;

    const drawWord = (alpha: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${ink.join(",")})`;
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(WORD, w / 2, h / 2);
      ctx.globalAlpha = 1;
    };

    // Turn the drawn word into particles by sampling its pixels on a small grid.
    const makeParticles = (): Particle[] => {
      drawWord(1);
      const step = 2;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, w, h);
      const metrics = ctx.measureText(WORD);
      const left = w / 2 - metrics.width / 2;
      const particles: Particle[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (Math.floor(y * dpr) * canvas.width + Math.floor(x * dpr)) * 4 + 3;
          if (data[i] < 128) continue;
          const across = (x - left) / metrics.width; // 0 at the left edge, 1 at the right
          particles.push({
            x,
            y,
            vx: 20 + Math.random() * 60,
            vy: -(30 + Math.random() * 90),
            delay: Math.min(Math.max(across, 0), 1) * 0.55 + Math.random() * 0.05,
            tint: TINTS[Math.floor(Math.random() * TINTS.length)],
          });
        }
      }
      return particles;
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      setLeaving(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Storage can be blocked; the intro then simply plays again next time.
      }
      document.documentElement.classList.remove("is-loading");
      timers.push(window.setTimeout(() => setGone(true), EXIT_MS));
    };

    const vaporise = (particles: Particle[]) => {
      const start = performance.now();
      let last = start;
      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const t = (now - start) / VAPOUR_MS; // 0..1 over the vapour phase
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          const life = (t - p.delay) / 0.4; // each particle fades out over 40% of the phase
          if (life <= 0) {
            ctx.fillStyle = `rgb(${ink.join(",")})`;
            ctx.fillRect(p.x, p.y, 2, 2);
            continue;
          }
          if (life >= 1) continue;
          p.x += p.vx * dt + (Math.random() - 0.5) * 1.5;
          p.y += p.vy * dt + (Math.random() - 0.5) * 1.5;
          p.vx *= 0.98;
          const c = ink.map((v, k) => Math.round(v + (p.tint[k] - v) * Math.min(life * 2, 1)));
          ctx.fillStyle = `rgba(${c.join(",")},${(1 - life) * (1 - life)})`;
          const size = 2 * (1 - life * 0.6);
          ctx.fillRect(p.x, p.y, size, size);
        }
        if (t < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };

    const run = async () => {
      // Wait (briefly) for the heading font so the particles match the site's typeface.
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 500))]);
      if (cancelled) return;

      const particles = makeParticles();
      const start = performance.now();
      const appear = (now: number) => {
        const t = now - start;
        drawWord(Math.min(t / APPEAR_MS, 1));
        const ready = t >= APPEAR_MS + HOLD_MS && (loaded || t >= MAX_WAIT_MS);
        if (ready) vaporise(particles);
        else frame = requestAnimationFrame(appear);
      };
      frame = requestAnimationFrame(appear);
    };
    run();

    // Safety net: animation frames pause in background tabs, so never keep the cover up longer than this.
    timers.push(window.setTimeout(finish, APPEAR_MS + HOLD_MS + MAX_WAIT_MS + VAPOUR_MS));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-label="Loading">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
}
