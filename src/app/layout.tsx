import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

export const metadata: Metadata = {
  title: "Vercel First Application",
  description: "First Application with Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
