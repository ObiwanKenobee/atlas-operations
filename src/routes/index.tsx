import { createFileRoute } from "@tanstack/react-router";
import earthHero from "@/assets/earth-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Sanctum — The Operating System for Regenerative Civilization" },
      {
        name: "description",
        content:
          "Atlas Sanctum is a civilization-scale decision intelligence platform. Truth infrastructure, digital twins, and multi-agent AI converge into one explainable interface.",
      },
      { property: "og:title", content: "Atlas Sanctum — Planetary Decision Intelligence" },
      {
        property: "og:description",
        content:
          "Transform fragmented data into trusted, explainable decisions for governments, NGOs, enterprises, investors, researchers, and communities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MissionControl,
});

const navItems = [
  { label: "Mission Control", active: true },
  { label: "Global Map" },
  { label: "Knowledge Graph" },
  { label: "Decision Studio" },
  { label: "Digital Twins" },
  { label: "Agents" },
];

const agents = [
  { code: "EC", name: "Ecology Agent", status: "Analyzing biodiversity threshold…", tone: "aurora", live: true },
  { code: "FN", name: "Finance Agent", status: "Simulating investment branch A–C…", tone: "solar", live: false },
  { code: "RK", name: "Risk Agent", status: "Audit complete. No conflicts.", tone: "ocean", live: false },
  { code: "CL", name: "Climate Agent", status: "Cross-checking IPCC AR6 pathways.", tone: "nebula", live: true },
];

const toneClass: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  aurora: { bg: "bg-aurora/15", text: "text-aurora", border: "border-aurora/30", dot: "bg-aurora" },
  solar: { bg: "bg-solar/15", text: "text-solar", border: "border-solar/30", dot: "bg-solar" },
  ocean: { bg: "bg-ocean/15", text: "text-ocean", border: "border-ocean/30", dot: "bg-ocean" },
  nebula: { bg: "bg-nebula/15", text: "text-nebula", border: "border-nebula/30", dot: "bg-nebula" },
};

function MissionControl() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground font-body selection:bg-primary/30">
      {/* Ambient atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.68_0.18_250/0.12)_0%,_transparent_60%)]" />
      </div>

      {/* Top OS Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-glass-border bg-background/40 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-foreground">
              <div className="size-2 rounded-full bg-background" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">ATLAS SANCTUM</span>
          </div>
          <div className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`transition-colors hover:text-primary ${item.active ? "text-foreground" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-aurora" />
            <span className="text-aurora">SYSTEM NOMINAL</span>
          </div>
          <div className="hidden text-muted-foreground md:block">LAT 40.7128° N</div>
          <div className="hidden text-muted-foreground md:block">LON 74.0060° W</div>
          <div className="rounded bg-white/5 px-2 py-1 text-muted-foreground">14:28:09 UTC</div>
        </div>
      </nav>

      {/* Main viewport */}
      <main className="relative z-10 flex min-h-screen flex-col pt-14">
        {/* Hero Earth visualization */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={earthHero}
            alt=""
            width={1920}
            height={1080}
            className="animate-spin-slow h-[120vh] max-h-[1400px] w-auto max-w-none object-contain opacity-55 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>

        {/* Headline */}
        <div className="animate-entrance relative z-20 flex flex-col items-center px-6 pt-24 text-center">
          <span className="mb-6 rounded-full border border-glass-border bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            Planetary Intelligence · Live
          </span>
          <h1 className="max-w-4xl text-balance font-display text-5xl font-black tracking-tighter sm:text-7xl">
            The operating system for{" "}
            <span className="bg-gradient-to-r from-ocean to-aurora bg-clip-text text-transparent">
              regenerative civilization.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty font-mono text-xs uppercase tracking-wide text-muted-foreground opacity-80 sm:text-sm">
            Synthesizing fragmented planetary data into trusted, explainable decisions.
          </p>
        </div>

        {/* Spatial UI overlay panels */}
        <div className="relative flex-1 p-4 sm:p-6">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Decision Studio */}
            <section className="animate-entrance [animation-delay:200ms] lg:col-span-4 lg:mt-8">
              <div className="rounded-xl border border-glass-border bg-glass p-5 ring-1 ring-white/5 backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-tighter text-primary">
                    Decision Studio // Active Prompt
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">ID: AS-772</span>
                </div>
                <div className="mb-6 rounded-lg border border-white/5 bg-white/5 p-3">
                  <p className="text-sm font-medium leading-relaxed">
                    "Where should we invest <span className="text-solar">$5M</span> for maximum
                    ecosystem restoration?"
                  </p>
                </div>

                <div className="space-y-3">
                  <ScenarioCard
                    title="Scenario A · Amazon Basin"
                    detail="Deforestation corridors, Pará. ROI 4.2× carbon seq."
                    confidence={94}
                    primary
                  />
                  <ScenarioCard
                    title="Scenario B · Great Barrier"
                    detail="Reef restoration + fisheries co-benefit."
                    confidence={82}
                  />
                  <ScenarioCard
                    title="Scenario C · Congo Peatlands"
                    detail="Protective moratorium + community trust."
                    confidence={76}
                  />
                </div>

                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:scale-[1.01]">
                  <span className="text-xs">◈</span>
                  Execute Simulation
                </button>
              </div>
            </section>

            {/* Center: reserved for Earth (spacer) + evidence chain below */}
            <section className="hidden lg:col-span-4 lg:block" />

            {/* Right: Agent war-room */}
            <section className="animate-entrance [animation-delay:400ms] lg:col-span-4 lg:mt-8">
              <div className="rounded-xl border border-glass-border bg-glass p-5 backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Active Intelligence Agents
                  </h3>
                  <span className="font-mono text-[10px] text-aurora">4 LIVE · SYNC 12ms</span>
                </div>
                <div className="space-y-3">
                  {agents.map((agent) => {
                    const t = toneClass[agent.tone];
                    return (
                      <div key={agent.code} className="flex items-start gap-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${t.bg} ${t.border}`}
                        >
                          <span className={`font-mono text-[10px] font-bold uppercase ${t.text}`}>
                            {agent.code}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-[11px] font-bold">{agent.name}</span>
                            <span
                              className={`size-1.5 rounded-full ${agent.live ? `${t.dot} animate-pulse-dot` : "bg-white/20"}`}
                            />
                          </div>
                          <p className="mt-0.5 text-[10px] italic text-muted-foreground">
                            {agent.status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-glass-border pt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Explainability Chain
                    </span>
                    <span className="font-mono text-[10px] text-aurora">Verified · 3 / 4</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1 flex-1 rounded-full bg-aurora/60" />
                    <div className="h-1 flex-1 rounded-full bg-aurora/60" />
                    <div className="h-1 flex-1 rounded-full bg-aurora/60" />
                    <div className="h-1 flex-1 rounded-full bg-white/10" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <EvidenceRow source="ESA Sentinel-2" ref="0x294…fE" conf={99.8} tone="ocean" />
                    <EvidenceRow source="IPCC AR6 WGIII" ref="v3.2-final" conf={84.1} tone="aurora" />
                    <EvidenceRow source="Global Forest Watch" ref="2026-Q3" conf={91.5} tone="solar" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom planetary ticker */}
          <div className="animate-entrance [animation-delay:600ms] pointer-events-none mt-10 flex justify-center px-4 pb-10">
            <div className="pointer-events-auto flex flex-wrap items-end gap-4">
              <div className="flex flex-wrap items-center gap-6 rounded-full border border-glass-border bg-background/60 px-8 py-4 shadow-2xl backdrop-blur-3xl">
                <Metric label="Atmosphere CO₂" value="421.4" delta="+0.2%" deltaTone="text-signal" />
                <Divider />
                <Metric
                  label="Hydrological Health"
                  value="68.2"
                  valueTone="text-ocean"
                  delta="STABLE"
                  deltaTone="text-aurora"
                />
                <Divider />
                <Metric
                  label="Energy Autonomy"
                  value="42.8%"
                  valueTone="text-solar"
                  delta="↑ EXPONENTIAL"
                  deltaTone="text-solar"
                />
                <Divider />
                <Metric
                  label="Biodiversity Δ"
                  value="+0.041"
                  valueTone="text-aurora"
                  delta="LY"
                  deltaTone="text-muted-foreground"
                />
              </div>

              <div className="w-56 rounded-2xl border border-glass-border bg-glass p-4 backdrop-blur-2xl">
                <div className="mb-3 flex items-center gap-2">
                  <div className="size-2 rounded-full bg-ocean shadow-[0_0_8px_var(--color-ocean)]" />
                  <span className="font-mono text-[10px] font-bold uppercase">
                    Node · Congo Basin
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connections</span>
                    <span>1,204</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dependencies</span>
                    <span>47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk index</span>
                    <span className="text-signal">CRITICAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]">
        <div className="mx-auto h-full max-w-[1600px] border-x border-white/20" />
      </div>
    </div>
  );
}

function ScenarioCard({
  title,
  detail,
  confidence,
  primary,
}: {
  title: string;
  detail: string;
  confidence: number;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        primary
          ? "border-primary/30 bg-primary/10"
          : "border-glass-border bg-white/5 opacity-70 hover:opacity-100"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span
          className={`text-[11px] font-bold uppercase ${primary ? "text-primary" : "text-foreground"}`}
        >
          {title}
        </span>
        <span
          className={`font-mono text-[10px] ${primary ? "text-primary" : "text-muted-foreground"}`}
        >
          {confidence}% CONF
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={primary ? "h-full bg-primary" : "h-full bg-white/40"}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{detail}</p>
    </div>
  );
}

function EvidenceRow({
  source,
  ref,
  conf,
  tone,
}: {
  source: string;
  ref: string;
  conf: number;
  tone: string;
}) {
  const t = toneClass[tone];
  return (
    <div className="flex items-center gap-2 rounded p-1.5 hover:bg-white/5">
      <div className={`size-3 rounded border ${t.bg} ${t.border}`} />
      <div className="flex flex-1 justify-between">
        <span className="text-[10px] text-foreground">{source}</span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {ref} · {conf}%
        </span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  deltaTone,
  valueTone,
}: {
  label: string;
  value: string;
  delta: string;
  deltaTone: string;
  valueTone?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[9px] uppercase text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`font-display text-xl font-bold ${valueTone ?? ""}`}>{value}</span>
        <span className={`font-mono text-[10px] ${deltaTone}`}>{delta}</span>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-8 w-px bg-glass-border" />;
}
