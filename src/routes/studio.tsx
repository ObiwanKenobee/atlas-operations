import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AtlasShell, GlassPanel, PageHeader } from "@/components/atlas-shell";
import { generateStrategies, type StrategyResult } from "@/lib/decision.functions";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Decision Studio · Atlas Sanctum" },
      {
        name: "description",
        content:
          "Compose a decision brief and generate multiple comparable strategies with evidence, trade-offs, forecasts, and confidence.",
      },
      { property: "og:title", content: "Decision Studio · Atlas Sanctum" },
      {
        property: "og:description",
        content:
          "Input goal, budget, constraints, timeline, policies, and geography. Compare AI-generated strategies side-by-side.",
      },
    ],
  }),
  component: DecisionStudio,
});

const tones = ["aurora", "ocean", "solar"] as const;
const toneBg: Record<string, string> = {
  aurora: "border-aurora/30 bg-aurora/5",
  ocean: "border-ocean/30 bg-ocean/5",
  solar: "border-solar/30 bg-solar/5",
};
const toneText: Record<string, string> = {
  aurora: "text-aurora",
  ocean: "text-ocean",
  solar: "text-solar",
};

function DecisionStudio() {
  const [goal, setGoal] = useState("Maximize ecosystem restoration in tropical peatlands");
  const [budgetUsd, setBudgetUsd] = useState(5_000_000);
  const [timelineYears, setTimelineYears] = useState(10);
  const [geography, setGeography] = useState("Central Kalimantan, Indonesia");
  const [constraints, setConstraints] = useState("No displacement of Indigenous communities");
  const [policies, setPolicies] = useState("Aligned with Paris Agreement Article 6");
  const [selected, setSelected] = useState(0);

  const run = useServerFn(generateStrategies);
  const mutation = useMutation({
    mutationFn: (input: {
      goal: string;
      budgetUsd: number;
      timelineYears: number;
      geography: string;
      constraints: string;
      policies: string;
    }) => run({ data: input }),
  });

  const result = mutation.data as StrategyResult | undefined;

  return (
    <AtlasShell>
      <main className="mx-auto max-w-[1600px] px-6 py-10">
        <PageHeader
          eyebrow="Decision Studio"
          title="Compose a decision. Compare strategies."
          subtitle="State a goal and constraints. Atlas synthesizes multiple explainable strategies with evidence, forecasts, and trade-offs — never a single answer."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <GlassPanel className="lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-tighter text-primary">
                Decision Brief
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">v4.2-α</span>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate({ goal, budgetUsd, timelineYears, geography, constraints, policies });
              }}
            >
              <Field label="Goal">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={2}
                  maxLength={500}
                  required
                  className="w-full resize-none rounded-md border border-white/10 bg-white/5 p-2 text-sm outline-none focus:border-primary/50"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Budget (USD)">
                  <input
                    type="number"
                    min={1000}
                    step={100000}
                    value={budgetUsd}
                    onChange={(e) => setBudgetUsd(Number(e.target.value))}
                    className="w-full rounded-md border border-white/10 bg-white/5 p-2 font-mono text-sm outline-none focus:border-primary/50"
                  />
                </Field>
                <Field label="Timeline (yrs)">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={timelineYears}
                    onChange={(e) => setTimelineYears(Number(e.target.value))}
                    className="w-full rounded-md border border-white/10 bg-white/5 p-2 font-mono text-sm outline-none focus:border-primary/50"
                  />
                </Field>
              </div>

              <Field label="Geography">
                <input
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  maxLength={200}
                  required
                  className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-sm outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="Constraints">
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={2}
                  maxLength={1000}
                  className="w-full resize-none rounded-md border border-white/10 bg-white/5 p-2 text-sm outline-none focus:border-primary/50"
                />
              </Field>

              <Field label="Policies">
                <textarea
                  value={policies}
                  onChange={(e) => setPolicies(e.target.value)}
                  rows={2}
                  maxLength={1000}
                  className="w-full resize-none rounded-md border border-white/10 bg-white/5 p-2 text-sm outline-none focus:border-primary/50"
                />
              </Field>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {mutation.isPending ? "Synthesizing strategies…" : "Execute Simulation"}
              </button>

              {mutation.isError ? (
                <p className="text-[11px] text-signal">
                  {(mutation.error as Error).message.includes("402")
                    ? "AI credits exhausted. Add credits in workspace billing."
                    : (mutation.error as Error).message.includes("429")
                      ? "Rate limited. Please retry shortly."
                      : "Simulation failed. Please retry."}
                </p>
              ) : null}
            </form>
          </GlassPanel>

          <section className="lg:col-span-8">
            {!result && !mutation.isPending ? (
              <GlassPanel className="flex min-h-[400px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 size-12 rounded-full border border-glass-border bg-white/5" />
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Awaiting decision brief
                  </p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Compose a brief on the left and execute. Atlas will return three comparable
                    strategies with evidence, forecasts, and trade-offs.
                  </p>
                </div>
              </GlassPanel>
            ) : null}

            {mutation.isPending ? (
              <GlassPanel className="min-h-[400px]">
                <div className="mb-4 flex items-center gap-2">
                  <span className="animate-pulse-dot size-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Ecology · Finance · Climate · Risk agents deliberating…
                  </span>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
                  ))}
                </div>
              </GlassPanel>
            ) : null}

            {result ? (
              <div className="space-y-6">
                <GlassPanel>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-aurora" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-aurora">
                      Consensus Summary
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </GlassPanel>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {result.strategies.slice(0, 3).map((s, i) => {
                    const tone = tones[i % tones.length];
                    const active = selected === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`rounded-xl border p-4 text-left transition-all backdrop-blur-2xl ${
                          active ? `${toneBg[tone]} ring-1 ring-white/10` : "border-glass-border bg-glass hover:bg-white/5"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`font-mono text-[10px] font-bold uppercase ${toneText[tone]}`}>
                            Strategy {String.fromCharCode(65 + i)}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {Math.round(s.confidence)}% CONF
                          </span>
                        </div>
                        <h3 className="mb-2 font-display text-base font-bold leading-tight">
                          {s.name}
                        </h3>
                        <p className="text-[11px] leading-snug text-muted-foreground line-clamp-3">
                          {s.thesis}
                        </p>
                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full ${tone === "aurora" ? "bg-aurora" : tone === "ocean" ? "bg-ocean" : "bg-solar"}`}
                            style={{ width: `${s.confidence}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <StrategyDetail strategy={result.strategies[selected]} />
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </AtlasShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function StrategyDetail({ strategy }: { strategy: StrategyResult["strategies"][number] }) {
  const maxY = Math.max(...strategy.forecast.map((f) => f.outcomeIndex), 100);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <GlassPanel>
        <h4 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Allocation
        </h4>
        <div className="space-y-2">
          {strategy.allocation.map((a, i) => (
            <div key={i}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span>{a.bucket}</span>
                <span className="font-mono text-muted-foreground">{Math.round(a.percent)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div className="h-full bg-primary/70" style={{ width: `${a.percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        <h4 className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Trade-offs
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {strategy.tradeoffs.map((t, i) => (
            <div key={i} className="rounded-md border border-white/5 bg-white/5 p-2">
              <div className="font-mono text-[9px] uppercase text-muted-foreground">{t.label}</div>
              <div className="text-sm font-bold">{t.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatBox label="Expected ROI" value={strategy.expectedRoi} tone="text-aurora" />
          <StatBox label="Time to Impact" value={strategy.timeToImpact} tone="text-ocean" />
        </div>
      </GlassPanel>

      <GlassPanel>
        <h4 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Outcome Forecast · Impact Index
        </h4>
        <svg viewBox="0 0 400 160" className="h-40 w-full">
          <defs>
            <linearGradient id="forecast" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.14 210)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="oklch(0.78 0.14 210)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="0"
              x2="400"
              y1={40 * i + 20}
              y2={40 * i + 20}
              stroke="oklch(1 0 0 / 0.05)"
            />
          ))}
          {strategy.forecast.length > 1 ? (
            <>
              <path
                d={`M ${strategy.forecast
                  .map(
                    (p, i) =>
                      `${(i / (strategy.forecast.length - 1)) * 400},${140 - (p.outcomeIndex / maxY) * 120}`,
                  )
                  .join(" L ")} L 400,140 L 0,140 Z`}
                fill="url(#forecast)"
              />
              <path
                d={`M ${strategy.forecast
                  .map(
                    (p, i) =>
                      `${(i / (strategy.forecast.length - 1)) * 400},${140 - (p.outcomeIndex / maxY) * 120}`,
                  )
                  .join(" L ")}`}
                fill="none"
                stroke="oklch(0.78 0.14 210)"
                strokeWidth="2"
              />
            </>
          ) : null}
        </svg>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
          <span>Y{strategy.forecast[0]?.year ?? 1}</span>
          <span>Y{strategy.forecast[strategy.forecast.length - 1]?.year ?? 10}</span>
        </div>

        <h4 className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Evidence Chain
        </h4>
        <div className="space-y-2">
          {strategy.evidence.map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-md border border-white/5 bg-white/5 p-2"
            >
              <div className="mt-0.5 size-2 shrink-0 rounded-full bg-aurora shadow-[0_0_6px_var(--color-aurora)]" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-[11px] font-bold">{e.source}</span>
                  <span className="font-mono text-[10px] text-aurora">
                    {Math.round(e.confidence)}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{e.note}</p>
              </div>
            </div>
          ))}
        </div>

        <h4 className="mb-2 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Known Risks
        </h4>
        <ul className="space-y-1">
          {strategy.risks.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <span className="mt-1 size-1 shrink-0 rounded-full bg-signal" />
              {r}
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/5 p-2">
      <div className="font-mono text-[9px] uppercase text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold ${tone}`}>{value}</div>
    </div>
  );
}
