import type { Metadata } from "next";
import { Merriweather, Mukta } from "next/font/google";
import FluidCursor from "./components/FluidCursor";
import Preloader from "./components/Preloader";
import ShaderBackground from "./components/ShaderBackground";
import "./globals.css";

const mukta = Mukta({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-mukta",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Chanon Wichai",
  description:
    "Portfolio of Chanon Wichai — software, embedded systems, IoT and AI projects.",
};

// Runs before first paint: applies the saved theme so the page doesn't flash, and decides
// whether the intro plays — first visit in this session gets `is-loading` (the preloader
// removes it when done), later page loads get `intro-seen` (preloader hidden).
const themeScript = `(function(){var t='dark',s=null;try{t=localStorage.getItem('theme')||'dark';s=sessionStorage.getItem('intro-seen')}catch(e){}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.classList.add(s?'intro-seen':'is-loading');d.style.colorScheme=t})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${mukta.variable} ${merriweather.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Without JavaScript the preloader could never leave, so don't show it at all. */}
        <noscript>
          <style>{`.preloader{display:none}`}</style>
        </noscript>
      </head>
      <body className="bg-white font-sans text-black antialiased dark:bg-black dark:text-white">
        <ShaderBackground />
        <FluidCursor />
        {children}
        <Preloader />
      </body>
    </html>
  );
}
