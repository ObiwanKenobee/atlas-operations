import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AtlasShell, GlassPanel, PageHeader } from "@/components/atlas-shell";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph · Atlas Sanctum" },
      {
        name: "description",
        content:
          "Explore an interactive knowledge graph of countries, rivers, forests, policies, and projects with dependency, risk, and time overlays.",
      },
      { property: "og:title", content: "Knowledge Graph · Atlas Sanctum" },
      {
        property: "og:description",
        content:
          "Time-evolving entity graph with dependency and risk overlays.",
      },
    ],
  }),
  component: KnowledgeGraph,
});

type NodeKind = "country" | "river" | "forest" | "policy" | "project" | "organization";
type Node = {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
  risk: number; // 0-100
  connections: number;
  firstYear: number;
};
type Edge = { a: string; b: string; kind: "depends" | "funds" | "affects"; firstYear: number };

const NODES: Node[] = [
  { id: "brazil", label: "Brazil", kind: "country", x: 320, y: 380, risk: 68, connections: 42, firstYear: 2000 },
  { id: "amazon", label: "Amazon Rainforest", kind: "forest", x: 300, y: 300, risk: 82, connections: 96, firstYear: 2000 },
  { id: "xingu", label: "Xingu River", kind: "river", x: 380, y: 340, risk: 74, connections: 34, firstYear: 2003 },
  { id: "para", label: "Pará State Policy", kind: "policy", x: 460, y: 300, risk: 44, connections: 18, firstYear: 2012 },
  { id: "restore", label: "Reforestation Alpha-7", kind: "project", x: 210, y: 240, risk: 32, connections: 12, firstYear: 2024 },
  { id: "wwf", label: "WWF", kind: "organization", x: 140, y: 340, risk: 12, connections: 61, firstYear: 2000 },
  { id: "indonesia", label: "Indonesia", kind: "country", x: 740, y: 380, risk: 71, connections: 38, firstYear: 2000 },
  { id: "borneo", label: "Borneo Peatlands", kind: "forest", x: 720, y: 300, risk: 88, connections: 54, firstYear: 2000 },
  { id: "kapuas", label: "Kapuas River", kind: "river", x: 800, y: 340, risk: 66, connections: 22, firstYear: 2005 },
  { id: "moratorium", label: "Peatland Moratorium", kind: "policy", x: 640, y: 260, risk: 38, connections: 14, firstYear: 2016 },
  { id: "congo", label: "DR Congo", kind: "country", x: 540, y: 420, risk: 79, connections: 29, firstYear: 2000 },
  { id: "congobasin", label: "Congo Peatlands", kind: "forest", x: 520, y: 340, risk: 91, connections: 48, firstYear: 2000 },
  { id: "ipcc", label: "IPCC AR6", kind: "policy", x: 480, y: 180, risk: 8, connections: 120, firstYear: 2022 },
  { id: "worldbank", label: "World Bank", kind: "organization", x: 640, y: 160, risk: 18, connections: 88, firstYear: 2000 },
];

const EDGES: Edge[] = [
  { a: "brazil", b: "amazon", kind: "affects", firstYear: 2000 },
  { a: "amazon", b: "xingu", kind: "depends", firstYear: 2000 },
  { a: "xingu", b: "para", kind: "affects", firstYear: 2012 },
  { a: "para", b: "restore", kind: "funds", firstYear: 2024 },
  { a: "wwf", b: "restore", kind: "funds", firstYear: 2024 },
  { a: "wwf", b: "amazon", kind: "depends", firstYear: 2000 },
  { a: "indonesia", b: "borneo", kind: "affects", firstYear: 2000 },
  { a: "borneo", b: "kapuas", kind: "depends", firstYear: 2005 },
  { a: "moratorium", b: "borneo", kind: "affects", firstYear: 2016 },
  { a: "congo", b: "congobasin", kind: "affects", firstYear: 2000 },
  { a: "ipcc", b: "amazon", kind: "depends", firstYear: 2022 },
  { a: "ipcc", b: "borneo", kind: "depends", firstYear: 2022 },
  { a: "ipcc", b: "congobasin", kind: "depends", firstYear: 2022 },
  { a: "worldbank", b: "moratorium", kind: "funds", firstYear: 2016 },
  { a: "worldbank", b: "restore", kind: "funds", firstYear: 2024 },
  { a: "worldbank", b: "congo", kind: "funds", firstYear: 2005 },
];

const kindColor: Record<NodeKind, string> = {
  country: "var(--color-ocean)",
  river: "var(--color-primary)",
  forest: "var(--color-aurora)",
  policy: "var(--color-solar)",
  project: "var(--color-nebula)",
  organization: "var(--color-foreground)",
};

const kindLabel: Record<NodeKind, string> = {
  country: "Country",
  river: "River",
  forest: "Forest",
  policy: "Policy",
  project: "Project",
  organization: "Organization",
};

function KnowledgeGraph() {
  const [year, setYear] = useState(2026);
  const [selectedId, setSelectedId] = useState<string>("amazon");
  const [showRisk, setShowRisk] = useState(true);
  const [showDeps, setShowDeps] = useState(true);
  const [kindFilter, setKindFilter] = useState<Set<NodeKind>>(
    new Set(["country", "river", "forest", "policy", "project", "organization"]),
  );

  const visibleNodes = useMemo(
    () => NODES.filter((n) => n.firstYear <= year && kindFilter.has(n.kind)),
    [year, kindFilter],
  );
  const visibleIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = useMemo(
    () => EDGES.filter((e) => e.firstYear <= year && visibleIds.has(e.a) && visibleIds.has(e.b)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, kindFilter],
  );

  const selected = NODES.find((n) => n.id === selectedId);
  const selectedNeighbors = selected
    ? EDGES.filter((e) => e.a === selectedId || e.b === selectedId)
        .map((e) => NODES.find((n) => n.id === (e.a === selectedId ? e.b : e.a))!)
        .filter(Boolean)
    : [];

  const toggleKind = (k: NodeKind) => {
    const next = new Set(kindFilter);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setKindFilter(next);
  };

  return (
    <AtlasShell>
      <main className="mx-auto max-w-[1600px] px-6 py-10">
        <PageHeader
          eyebrow="Knowledge Graph"
          title="Every entity, every dependency."
          subtitle="Countries, rivers, forests, policies, projects, and organizations — connected through time. Scrub the timeline to watch the graph evolve."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <GlassPanel className="lg:col-span-3">
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Entity Types
            </h4>
            <div className="space-y-1.5">
              {(Object.keys(kindLabel) as NodeKind[]).map((k) => {
                const active = kindFilter.has(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleKind(k)}
                    className={`flex w-full items-center gap-2 rounded-md border p-2 text-left text-[11px] transition-colors ${
                      active
                        ? "border-white/10 bg-white/5"
                        : "border-transparent opacity-40 hover:opacity-70"
                    }`}
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: kindColor[k] }}
                    />
                    <span className="flex-1">{kindLabel[k]}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {NODES.filter((n) => n.kind === k).length}
                    </span>
                  </button>
                );
              })}
            </div>

            <h4 className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Overlays
            </h4>
            <div className="space-y-2">
              <Toggle label="Risk heatmap" checked={showRisk} onChange={setShowRisk} />
              <Toggle label="Dependency edges" checked={showDeps} onChange={setShowDeps} />
            </div>

            <div className="mt-6 rounded-md border border-white/5 bg-white/5 p-3">
              <div className="mb-1 font-mono text-[9px] uppercase text-muted-foreground">Graph state</div>
              <div className="flex justify-between text-[11px]">
                <span>Nodes</span>
                <span className="font-mono">{visibleNodes.length}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Edges</span>
                <span className="font-mono">{visibleEdges.length}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Year</span>
                <span className="font-mono text-primary">{year}</span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="lg:col-span-6">
            <svg viewBox="0 0 900 500" className="h-[480px] w-full">
              <defs>
                <radialGradient id="riskAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.68 0.22 25)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="oklch(0.68 0.22 25)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {showDeps &&
                visibleEdges.map((e, i) => {
                  const a = NODES.find((n) => n.id === e.a)!;
                  const b = NODES.find((n) => n.id === e.b)!;
                  const active = selectedId === e.a || selectedId === e.b;
                  const color =
                    e.kind === "funds"
                      ? "var(--color-solar)"
                      : e.kind === "depends"
                        ? "var(--color-ocean)"
                        : "var(--color-aurora)";
                  return (
                    <line
                      key={i}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={color}
                      strokeOpacity={active ? 0.8 : 0.18}
                      strokeWidth={active ? 1.5 : 0.7}
                      strokeDasharray={e.kind === "depends" ? "3 3" : undefined}
                    />
                  );
                })}

              {visibleNodes.map((n) => {
                const active = selectedId === n.id;
                const size = active ? 12 : 6 + n.connections / 20;
                return (
                  <g
                    key={n.id}
                    onClick={() => setSelectedId(n.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {showRisk && n.risk > 50 ? (
                      <circle cx={n.x} cy={n.y} r={30 + n.risk / 3} fill="url(#riskAura)" />
                    ) : null}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={size}
                      fill={kindColor[n.kind]}
                      stroke={active ? "var(--color-foreground)" : "transparent"}
                      strokeWidth={2}
                      opacity={active ? 1 : 0.85}
                    />
                    <text
                      x={n.x}
                      y={n.y - size - 6}
                      textAnchor="middle"
                      className="fill-foreground/80"
                      style={{
                        fontSize: active ? "11px" : "9px",
                        fontFamily: "var(--font-mono)",
                        pointerEvents: "none",
                      }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Timeline
                </span>
                <span className="font-mono text-[10px] text-primary">{year}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={2035}
                step={1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full accent-primary"
                aria-label="Timeline year"
              />
              <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
                <span>2000</span>
                <span>2017</span>
                <span>2035 (projected)</span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="lg:col-span-3">
            {selected ? (
              <>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ background: kindColor[selected.kind] }}
                  />
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    {kindLabel[selected.kind]}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold">{selected.label}</h3>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <StatBox label="Risk index" value={`${selected.risk}`} tone={selected.risk > 70 ? "text-signal" : selected.risk > 40 ? "text-solar" : "text-aurora"} />
                  <StatBox label="Connections" value={`${selected.connections}`} />
                  <StatBox label="First seen" value={`${selected.firstYear}`} />
                  <StatBox label="Δ vs 2020" value={selected.risk > 60 ? "+18%" : "-4%"} tone={selected.risk > 60 ? "text-signal" : "text-aurora"} />
                </div>

                <h4 className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Neighbors ({selectedNeighbors.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedNeighbors.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedId(n.id)}
                      className="flex w-full items-center gap-2 rounded-md border border-white/5 bg-white/5 p-2 text-left text-[11px] hover:bg-white/10"
                    >
                      <span className="size-2 rounded-full" style={{ background: kindColor[n.kind] }} />
                      <span className="flex-1">{n.label}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">R{n.risk}</span>
                    </button>
                  ))}
                </div>

                <h4 className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Evidence
                </h4>
                <div className="space-y-1.5 text-[10px] text-muted-foreground">
                  <div>· Sentinel-2 tile 2026-Q3</div>
                  <div>· IPCC AR6 land-use ref v3.2</div>
                  <div>· Global Forest Watch 2026</div>
                </div>
              </>
            ) : null}
          </GlassPanel>
        </div>
      </main>
    </AtlasShell>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-white/5 bg-white/5 p-2 text-[11px]"
    >
      <span>{label}</span>
      <span
        className={`h-4 w-7 rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-white/10"}`}
      >
        <span
          className={`block size-3 rounded-full bg-white transition-transform ${checked ? "translate-x-3" : ""}`}
        />
      </span>
    </button>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/5 p-2">
      <div className="font-mono text-[9px] uppercase text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
