import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chanon Wichai | Electronic & Computer Engineer",
  description:
    "Portfolio of Chanon Wichai — software, embedded systems, IoT and AI projects.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}