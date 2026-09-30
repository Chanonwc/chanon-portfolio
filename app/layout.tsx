import type { Metadata } from "next";
import { Merriweather, Mukta } from "next/font/google";
import FluidCursor from "./components/FluidCursor";
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

// Applies the saved theme before first paint so the page doesn't flash.
const themeScript = `(function(){var t='dark';try{t=localStorage.getItem('theme')||'dark'}catch(e){}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t})()`;

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
      </head>
      <body className="bg-white font-sans text-black antialiased dark:bg-black dark:text-white">
        <FluidCursor />
        {children}
      </body>
    </html>
  );
}
