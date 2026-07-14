import { createFileRoute, Link } from "@tanstack/react-router";
import earthHero from "@/assets/earth-hero.jpg";
import { AtlasShell } from "@/components/atlas-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Sanctum — The Operating System for Regenerative Civilization" },
      {
        name: "description",
        content:
          "A civilization-scale decision intelligence platform. Truth infrastructure, digital twins, and multi-agent AI in one explainable interface.",
      },
      { property: "og:title", content: "Atlas Sanctum — Planetary Decision Intelligence" },
      {
        property: "og:description",
        content:
          "Transform fragmented data into trusted, explainable decisions for governments, NGOs, enterprises, investors, researchers, and communities.",
      },
    ],
  }),
  component: MissionControl,
});

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
    <AtlasShell>
      <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col">
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

        <div className="animate-entrance relative z-20 flex flex-col items-center px-6 pt-16 text-center">
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/studio"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:scale-[1.02]"
            >
              Open Decision Studio
            </Link>
            <Link
              to="/war-room"
              className="rounded-lg border border-glass-border bg-white/5 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-white/10"
            >
              Enter War Room
            </Link>
          </div>
        </div>

        <div className="relative flex-1 p-4 sm:p-6">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="animate-entrance [animation-delay:200ms] lg:col-span-4 lg:mt-8">
              <div className="rounded-xl border border-glass-border bg-glass p-5 ring-1 ring-white/5 backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-tighter text-primary">
                    Decision Studio · Active Prompt
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">ID AS-772</span>
                </div>
                <div className="mb-4 rounded-lg border border-white/5 bg-white/5 p-3">
                  <p className="text-sm font-medium leading-relaxed">
                    "Where should we invest <span className="text-solar">$5M</span> for maximum
                    ecosystem restoration?"
                  </p>
                </div>
                <div className="space-y-2 text-[11px]">
                  <ScenarioRow name="Amazon Basin" conf={94} primary />
                  <ScenarioRow name="Great Barrier" conf={82} />
                  <ScenarioRow name="Congo Peatlands" conf={76} />
                </div>
                <Link
                  to="/studio"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:scale-[1.01]"
                >
                  Run New Simulation
                </Link>
              </div>
            </section>

            <section className="hidden lg:col-span-4 lg:block" />

            <section className="animate-entrance [animation-delay:400ms] lg:col-span-4 lg:mt-8">
              <div className="rounded-xl border border-glass-border bg-glass p-5 backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Active Intelligence Agents
                  </h3>
                  <Link to="/war-room" className="font-mono text-[10px] text-aurora hover:underline">
                    OPEN →
                  </Link>
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
              </div>
            </section>
          </div>

          <div className="animate-entrance [animation-delay:600ms] mt-10 flex flex-wrap justify-center gap-4 px-4 pb-10">
            <div className="flex flex-wrap items-center gap-6 rounded-full border border-glass-border bg-background/60 px-8 py-4 shadow-2xl backdrop-blur-3xl">
              <Metric label="Atmosphere CO₂" value="421.4" delta="+0.2%" deltaTone="text-signal" />
              <Divider />
              <Metric label="Hydrological Health" value="68.2" valueTone="text-ocean" delta="STABLE" deltaTone="text-aurora" />
              <Divider />
              <Metric label="Energy Autonomy" value="42.8%" valueTone="text-solar" delta="↑ EXPONENTIAL" deltaTone="text-solar" />
              <Divider />
              <Metric label="Biodiversity Δ" value="+0.041" valueTone="text-aurora" delta="LY" deltaTone="text-muted-foreground" />
            </div>
          </div>
        </div>
      </main>
    </AtlasShell>
  );
}

function ScenarioRow({ name, conf, primary }: { name: string; conf: number; primary?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-md border p-2 ${primary ? "border-primary/30 bg-primary/10" : "border-glass-border bg-white/5"}`}
    >
      <span className="flex-1 font-bold">{name}</span>
      <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
        <div
          className={primary ? "h-full bg-primary" : "h-full bg-white/40"}
          style={{ width: `${conf}%` }}
        />
      </div>
      <span className={`font-mono ${primary ? "text-primary" : "text-muted-foreground"}`}>
        {conf}%
      </span>
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
