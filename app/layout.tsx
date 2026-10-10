import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SANKET | Counter Access",
  description: "A calmer, more accessible way to support public-service communication.",
  applicationName: "SANKET Counter Access",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
