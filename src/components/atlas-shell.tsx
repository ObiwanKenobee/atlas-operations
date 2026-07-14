import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navItems = [
  { label: "Mission Control", to: "/" },
  { label: "Decision Studio", to: "/studio" },
  { label: "Knowledge Graph", to: "/graph" },
  { label: "Digital Twins", to: "/twins" },
  { label: "War Room", to: "/war-room" },
] as const;

export function AtlasShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground font-body selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.68_0.18_250/0.10)_0%,_transparent_60%)]" />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-glass-border bg-background/60 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-foreground">
              <div className="size-2 rounded-full bg-background" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">ATLAS SANCTUM</span>
          </Link>
          <div className="hidden items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`transition-colors hover:text-primary ${active ? "text-foreground" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-aurora" />
            <span className="text-aurora">SYSTEM NOMINAL</span>
          </div>
          <div className="hidden rounded bg-white/5 px-2 py-1 text-muted-foreground md:block">
            14:28:09 UTC
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-14">{children}</div>

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]">
        <div className="mx-auto h-full max-w-[1600px] border-x border-white/20" />
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8 animate-entrance">
      <span className="mb-3 inline-block rounded-full border border-glass-border bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
      <h1 className="font-display text-4xl font-black tracking-tighter sm:text-5xl">{title}</h1>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </header>
  );
}

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-glass-border bg-glass p-5 ring-1 ring-white/5 backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}
