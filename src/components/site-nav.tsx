"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "/admin", label: "Admin" },
];

export function SiteNav() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-3 backdrop-blur md:px-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-lg font-semibold text-cyan-300">
          FX
        </div>
        <div>
          <p className="text-lg font-semibold tracking-wide text-white">FathusX</p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Universal Edu</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/dashboard" className="text-sm text-slate-300 transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/profile" className="text-sm text-slate-300 transition hover:text-white">
              Profile
            </Link>
            <Link href="/achievements" className="text-sm text-slate-300 transition hover:text-white">
              Achievements
            </Link>
            <Link href="/community" className="text-sm text-slate-300 transition hover:text-white">
              Community
            </Link>
            <Link href="/leaderboard" className="text-sm text-slate-300 transition hover:text-white">
              Leaderboard
            </Link>
            <Link href="/tutor" className="text-sm text-slate-300 transition hover:text-white">
              Tutor
            </Link>
            <Link href="/notifications" className="text-sm text-slate-300 transition hover:text-white">
              Notifications
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-slate-300 transition hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
