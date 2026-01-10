"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Koleksiyon", subtitle = "Koleksiyon Listesi" }: HeaderProps) {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex items-center justify-between px-6 relative z-40">
      
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h1>
        <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
      </div>

      
      <div className="flex items-center gap-3">
        
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors"
          title={theme === "light" ? "Koyu temaya gec" : "Acik temaya gec"}
        >
          {theme === "light" ? (
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          )}
        </button>

        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--info)] flex items-center justify-center text-white font-medium text-sm">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {session?.user?.name || "Kullanici"}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {session?.user?.email || ""}
              </p>
            </div>
            <svg className="w-4 h-4 text-[var(--text-tertiary)] hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 py-2 animate-fadeIn">
                <div className="px-4 py-3 border-b border-[var(--border-color)]">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {session?.user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full px-4 py-2.5 text-left text-sm text-[var(--error)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cikis Yap
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
