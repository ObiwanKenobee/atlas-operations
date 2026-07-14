import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AtlasShell, GlassPanel, PageHeader } from "@/components/atlas-shell";

export const Route = createFileRoute("/twins")({
  head: () => ({
    meta: [
      { title: "Digital Twins · Atlas Sanctum" },
      {
        name: "description",
        content:
          "Live simulation of city, watershed, forest, and grid twins. Pause, replay, branch timelines, and compare futures across probability and policy dimensions.",
      },
      { property: "og:title", content: "Digital Twins · Atlas Sanctum" },
      {
        property: "og:description",
        content:
          "Pause, replay, branch, and compare future scenarios in real time.",
      },
    ],
  }),
  component: DigitalTwins,
});

const TWIN_OPTIONS = [
  { id: "amazon", label: "Amazon Watershed" },
  { id: "jakarta", label: "Jakarta Metropolitan" },
  { id: "california", label: "California Grid" },
  { id: "borneo", label: "Borneo Peatland" },
] as const;

type TwinId = (typeof TWIN_OPTIONS)[number]["id"];

const HISTORY_YEARS = 15;
const FUTURE_YEARS = 20;

function simulate(seed: number, budgetM: number, probability: number, policyOn: boolean) {
  const arr: number[] = [];
  const baseline = 50;
  for (let i = 0; i < HISTORY_YEARS + FUTURE_YEARS; i++) {
    const isFuture = i >= HISTORY_YEARS;
    const t = i - HISTORY_YEARS;
    // deterministic pseudo-noise
    const n = Math.sin(seed + i * 0.7) * 3 + Math.cos(seed * 2 + i * 0.3) * 2;
    let value = baseline + n - i * 0.4;
    if (isFuture) {
      const trend = (budgetM / 50) * probability * (policyOn ? 1.4 : 0.8);
      value += trend * Math.log(1 + t);
    }
    arr.push(Math.max(0, Math.min(100, value)));
  }
  return arr;
}

function DigitalTwins() {
  const [twin, setTwin] = useState<TwinId>("amazon");
  const [year, setYear] = useState(HISTORY_YEARS); // playhead index
  const [playing, setPlaying] = useState(false);
  const [budgetM, setBudgetM] = useState(50);
  const [probability, setProbability] = useState(0.6);
  const [policyOn, setPolicyOn] = useState(true);
  const [branchOn, setBranchOn] = useState(true);
  const rafRef = useRef<number | null>(null);

  const seed = useMemo(() => TWIN_OPTIONS.findIndex((t) => t.id === twin) * 7 + 1, [twin]);
  const primary = useMemo(() => simulate(seed, budgetM, probability, policyOn), [seed, budgetM, probability, policyOn]);
  const branch = useMemo(() => simulate(seed + 100, budgetM * 0.5, probability * 0.7, !policyOn), [seed, budgetM, probability, policyOn]);
  const baseline = useMemo(() => simulate(seed + 200, 0, 0, false), [seed]);

  useEffect(() => {
    if (!playing) return;
    const step = () => {
      setYear((y) => {
        const next = y + 0.2;
        if (next >= HISTORY_YEARS + FUTURE_YEARS - 1) {
          setPlaying(false);
          return HISTORY_YEARS + FUTURE_YEARS - 1;
        }
        return next;
      });
      rafRef.current = window.setTimeout(step, 80) as unknown as number;
    };
    rafRef.current = window.setTimeout(step, 80) as unknown as number;
    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [playing]);

  const currentValue = primary[Math.round(year)] ?? 0;
  const branchValue = branch[Math.round(year)] ?? 0;
  const baseYear = 2011;

  return (
    <AtlasShell>
      <main className="mx-auto max-w-[1600px] px-6 py-10">
        <PageHeader
          eyebrow="Digital Twins"
          title="Simulate futures. Compare branches."
          subtitle="Pause, replay, and branch the twin's timeline. Adjust budget, probability, and policy sliders to watch alternate futures diverge in real time."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <GlassPanel className="lg:col-span-3">
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Active Twin
            </h4>
            <div className="space-y-1.5">
              {TWIN_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTwin(t.id)}
                  className={`w-full rounded-md border p-2 text-left text-[11px] transition-colors ${
                    twin === t.id
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <h4 className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Simulation Controls
            </h4>
            <Slider
              label="Budget"
              value={budgetM}
              min={0}
              max={200}
              onChange={setBudgetM}
              format={(v) => `$${v}M`}
            />
            <Slider
              label="Probability"
              value={probability}
              min={0}
              max={1}
              step={0.05}
              onChange={setProbability}
              format={(v) => `${Math.round(v * 100)}%`}
            />

            <div className="mt-4 space-y-2">
              <Toggle label="Policy: Restoration Act" checked={policyOn} onChange={setPolicyOn} />
              <Toggle label="Branch: alt-timeline overlay" checked={branchOn} onChange={setBranchOn} />
            </div>

            <h4 className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Climate Scenario
            </h4>
            <div className="grid grid-cols-3 gap-1">
              {["RCP 2.6", "RCP 4.5", "RCP 8.5"].map((s, i) => (
                <button
                  key={s}
                  className={`rounded border p-1.5 text-[10px] font-mono transition-colors ${
                    i === 1
                      ? "border-solar/30 bg-solar/10 text-solar"
                      : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="lg:col-span-9">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Ecosystem Health Index
                </div>
                <div className="mt-1 flex items-baseline gap-4">
                  <span className="font-display text-4xl font-bold text-aurora">
                    {currentValue.toFixed(1)}
                  </span>
                  {branchOn ? (
                    <span className="font-display text-xl font-bold text-solar">
                      {branchValue.toFixed(1)}
                      <span className="ml-1 font-mono text-[10px] text-muted-foreground">alt</span>
                    </span>
                  ) : null}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Y{Math.round(year) + baseYear} ·{" "}
                    {Math.round(year) >= HISTORY_YEARS ? "PROJECTED" : "HISTORY"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ControlBtn
                  onClick={() => {
                    setPlaying(false);
                    setYear(0);
                  }}
                  label="Replay"
                />
                <ControlBtn
                  onClick={() => setPlaying((p) => !p)}
                  primary
                  label={playing ? "Pause" : "Play"}
                />
                <ControlBtn
                  onClick={() => setYear(HISTORY_YEARS + FUTURE_YEARS - 1)}
                  label="Jump →"
                />
              </div>
            </div>

            <div className="relative">
              <svg viewBox="0 0 800 300" className="h-72 w-full">
                <defs>
                  <linearGradient id="primaryFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.18 155)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="oklch(0.78 0.18 155)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map((v) => (
                  <g key={v}>
                    <line
                      x1={40}
                      x2={800}
                      y1={280 - (v / 100) * 260}
                      y2={280 - (v / 100) * 260}
                      stroke="oklch(1 0 0 / 0.05)"
                    />
                    <text
                      x={0}
                      y={284 - (v / 100) * 260}
                      className="fill-muted-foreground"
                      style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}
                    >
                      {v}
                    </text>
                  </g>
                ))}

                <rect
                  x={40 + (HISTORY_YEARS / (HISTORY_YEARS + FUTURE_YEARS - 1)) * 760}
                  y={20}
                  width={760 - (HISTORY_YEARS / (HISTORY_YEARS + FUTURE_YEARS - 1)) * 760}
                  height={260}
                  fill="oklch(0.68 0.18 250 / 0.05)"
                />
                <text
                  x={40 + (HISTORY_YEARS / (HISTORY_YEARS + FUTURE_YEARS - 1)) * 760 + 6}
                  y={32}
                  className="fill-muted-foreground"
                  style={{ fontSize: "9px", fontFamily: "var(--font-mono)" }}
                >
                  PROJECTED FUTURE
                </text>

                <LinePath data={baseline} stroke="oklch(1 0 0 / 0.25)" dashed />
                {branchOn ? <LinePath data={branch} stroke="var(--color-solar)" /> : null}
                <LinePath data={primary} stroke="var(--color-aurora)" fill="url(#primaryFill)" />

                <line
                  x1={40 + (year / (HISTORY_YEARS + FUTURE_YEARS - 1)) * 760}
                  x2={40 + (year / (HISTORY_YEARS + FUTURE_YEARS - 1)) * 760}
                  y1={20}
                  y2={280}
                  stroke="var(--color-primary)"
                  strokeWidth={1.5}
                />
                <circle
                  cx={40 + (year / (HISTORY_YEARS + FUTURE_YEARS - 1)) * 760}
                  cy={280 - (currentValue / 100) * 260}
                  r={5}
                  fill="var(--color-primary)"
                  stroke="var(--color-background)"
                  strokeWidth={2}
                />
              </svg>

              <div className="mt-3 flex items-center gap-3 text-[10px]">
                <input
                  type="range"
                  min={0}
                  max={HISTORY_YEARS + FUTURE_YEARS - 1}
                  step={0.1}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="flex-1 accent-primary"
                  aria-label="Timeline scrubber"
                />
              </div>

              <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
                <LegendDot color="var(--color-aurora)" label="Primary future" />
                {branchOn ? <LegendDot color="var(--color-solar)" label="Alt branch" /> : null}
                <LegendDot color="oklch(1 0 0 / 0.35)" label="Baseline (no action)" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <FutureCompare
                title="Ecosystem Delta"
                value={`+${(currentValue - baseline[Math.round(year)]).toFixed(1)}`}
                tone="text-aurora"
                sub="vs baseline"
              />
              <FutureCompare
                title="Cost / Impact"
                value={`$${(budgetM / Math.max(1, currentValue - baseline[Math.round(year)])).toFixed(2)}M`}
                sub="per index pt"
              />
              <FutureCompare
                title="Tipping Risk"
                value={probability < 0.4 ? "HIGH" : probability < 0.7 ? "MODERATE" : "LOW"}
                tone={probability < 0.4 ? "text-signal" : probability < 0.7 ? "text-solar" : "text-aurora"}
                sub="cascade prob."
              />
              <FutureCompare
                title="Convergence"
                value={`${Math.round(HISTORY_YEARS + FUTURE_YEARS * probability)}`}
                sub="years to stabilize"
              />
            </div>
          </GlassPanel>
        </div>
      </main>
    </AtlasShell>
  );
}

function LinePath({
  data,
  stroke,
  fill,
  dashed,
}: {
  data: number[];
  stroke: string;
  fill?: string;
  dashed?: boolean;
}) {
  const pts = data.map((v, i) => {
    const x = 40 + (i / (data.length - 1)) * 760;
    const y = 280 - (v / 100) * 260;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  return (
    <>
      {fill ? <path d={`${d} L 800,280 L 40,280 Z`} fill={fill} /> : null}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
    </>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-primary">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
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

function ControlBtn({
  onClick,
  label,
  primary,
}: {
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors ${
        primary
          ? "border-primary/30 bg-primary text-primary-foreground"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function FutureCompare({
  title,
  value,
  sub,
  tone,
}: {
  title: string;
  value: string;
  sub: string;
  tone?: string;
}) {
  return (
    <div className="rounded-md border border-white/5 bg-white/5 p-3">
      <div className="font-mono text-[9px] uppercase text-muted-foreground">{title}</div>
      <div className={`mt-1 font-display text-xl font-bold ${tone ?? ""}`}>{value}</div>
      <div className="font-mono text-[9px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
