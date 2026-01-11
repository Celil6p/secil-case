import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { EnvError } from "@/components/EnvError";
import { getMissingEnvVars } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koleksiyon Yonetim Platformu",
  description: "Secil Store Koleksiyon Yonetim Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const missingEnvVars = getMissingEnvVars();
  const hasEnvError = missingEnvVars.length > 0;

  // If env vars are missing, show error page instead of app
  if (hasEnvError) {
    return (
      <html lang="tr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <EnvError missingVars={missingEnvVars} />
        </body>
      </html>
    );
  }

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
