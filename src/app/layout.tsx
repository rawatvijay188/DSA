import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Atlas",
  description: "34-day, 193-problem DSA mastery course with solutions and visualizers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
