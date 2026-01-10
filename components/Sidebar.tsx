"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Urunler",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    expandable: true,
    children: [],
  },
];

const salesItems = [
  {
    label: "Koleksiyon",
    href: "/collections",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="sidebar w-56 min-h-screen flex-shrink-0 hidden lg:block">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
        <Link href="/collections" className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'system-ui' }}>
          <span className="text-[var(--text-primary)]">L</span>
          <span className="text-[var(--text-primary)]" style={{ letterSpacing: '-0.1em' }}>O</span>
          <span className="text-[var(--text-primary)]" style={{ letterSpacing: '-0.05em' }}>G</span>
          <span className="text-[var(--text-primary)]" style={{ letterSpacing: '-0.1em' }}>O</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Menu
          </p>
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.expandable ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`sidebar-item w-full ${isActive(item.href) ? "active" : ""}`}
                >
                  {item.icon}
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedMenus.includes(item.label) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link href={item.href} className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}>
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Satis
          </p>
          {salesItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item ${isActive(item.href) ? "active" : ""}`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
