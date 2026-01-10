"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ToastContainer } from "@/components/Toast";
import { ThemeProvider } from "@/lib/theme";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        {children}
        <ToastContainer />
      </SessionProvider>
    </ThemeProvider>
  );
}
