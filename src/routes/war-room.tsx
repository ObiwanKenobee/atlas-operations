import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AtlasShell, GlassPanel, PageHeader } from "@/components/atlas-shell";
import { runDebate, type DebateResult } from "@/lib/warroom.functions";

export const Route = createFileRoute("/war-room")({
  head: () => ({
    meta: [
      { title: "AI War Room · Atlas Sanctum" },
      {
        name: "description",
        content:
          "Watch specialized AI agents debate, verify evidence, and reach consensus — with human approval before any action is taken.",
      },
      { property: "og:title", content: "AI War Room · Atlas Sanctum" },
      {
        property: "og:description",
        content:
          "Multi-agent deliberation with dependency, evidence, and consensus surfaces.",
      },
    ],
  }),
  component: WarRoom,
});

const AGENTS = [
  { name: "Dr. Aris Thorne", role: "Ecology Agent", tone: "aurora", short: "EC" },
  { name: "Marcus Chen", role: "Finance Agent", tone: "solar", short: "FN" },
  { name: "Sarah Grewal", role: "Policy Agent", tone: "ocean", short: "PL" },
  { name: "Nadia Okafor", role: "Climate Agent", tone: "nebula", short: "CL" },
  { name: "Sentinel-1 AI", role: "Risk Agent", tone: "signal", short: "RK" },
  { name: "Dr. Elena Vasquez", role: "Health Agent", tone: "primary", short: "HL" },
] as const;

const toneClass: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  aurora: { text: "text-aurora", bg: "bg-aurora/15", border: "border-aurora/30", dot: "bg-aurora" },
  solar: { text: "text-solar", bg: "bg-solar/15", border: "border-solar/30", dot: "bg-solar" },
  ocean: { text: "text-ocean", bg: "bg-ocean/15", border: "border-ocean/30", dot: "bg-ocean" },
  nebula: { text: "text-nebula", bg: "bg-nebula/15", border: "border-nebula/30", dot: "bg-nebula" },
  signal: { text: "text-signal", bg: "bg-signal/15", border: "border-signal/30", dot: "bg-signal" },
  primary: { text: "text-primary", bg: "bg-primary/15", border: "border-primary/30", dot: "bg-primary" },
};

const roleTone = AGENTS.reduce<Record<string, string>>((acc, a) => {
  acc[a.role] = a.tone;
  return acc;
}, {});

function WarRoom() {
  const [question, setQuestion] = useState(
    "Should we halt palm oil expansion in Borneo peatlands, given trade-offs with local employment and food security?",
  );
  const [approved, setApproved] = useState<"pending" | "approved" | "rejected">("pending");
  const run = useServerFn(runDebate);
  const mutation = useMutation({
    mutationFn: (q: string) => run({ data: { question: q } }),
    onSuccess: () => setApproved("pending"),
  });

  const result = mutation.data as DebateResult | undefined;

  return (
    <AtlasShell>
      <main className="mx-auto max-w-[1600px] px-6 py-10">
        <PageHeader
          eyebrow="Multi-Agent War Room"
          title="Agents debate. Humans decide."
          subtitle="Six specialized agents challenge each other's evidence, expose dependencies, and converge on a consensus you approve before anything ships."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: agents roster */}
          <GlassPanel className="lg:col-span-3">
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Deployed Agents
            </h4>
            <div className="space-y-2.5">
              {AGENTS.map((a) => {
                const t = toneClass[a.tone];
                const active = mutation.isPending;
                return (
                  <div key={a.short} className="flex items-start gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${t.bg} ${t.border}`}
                    >
                      <span className={`font-mono text-[10px] font-bold ${t.text}`}>{a.short}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold leading-tight">{a.name}</span>
                        <span
                          className={`size-1.5 rounded-full ${active ? `${t.dot} animate-pulse-dot` : "bg-white/20"}`}
                        />
                      </div>
                      <div className="font-mono text-[9px] uppercase text-muted-foreground">
                        {a.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <h4 className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Dependencies
            </h4>
            <svg viewBox="0 0 200 140" className="w-full">
              {AGENTS.map((_, i) => {
                const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 55;
                const y = 70 + Math.sin(angle) * 45;
                return AGENTS.map((_, j) => {
                  if (j <= i) return null;
                  const angle2 = (j / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
                  const x2 = 100 + Math.cos(angle2) * 55;
                  const y2 = 70 + Math.sin(angle2) * 45;
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={x}
                      y1={y}
                      x2={x2}
                      y2={y2}
                      stroke="oklch(1 0 0 / 0.08)"
                      strokeWidth={0.5}
                    />
                  );
                });
              })}
              {AGENTS.map((a, i) => {
                const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 55;
                const y = 70 + Math.sin(angle) * 45;
                const t = toneClass[a.tone];
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={9} className={t.bg.replace("bg-", "fill-")} opacity={0.4} />
                    <circle cx={x} cy={y} r={5} className={t.dot.replace("bg-", "fill-")} />
                    <text
                      x={x}
                      y={y + 2}
                      textAnchor="middle"
                      style={{ fontSize: "6px", fontFamily: "var(--font-mono)" }}
                      className="fill-foreground"
                    >
                      {a.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </GlassPanel>

          {/* Center: debate */}
          <section className="space-y-4 lg:col-span-6">
            <GlassPanel>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Question to the War Room
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full resize-none rounded-md border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-primary/50"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  6 agents will deliberate · Human approval required
                </span>
                <button
                  onClick={() => mutation.mutate(question)}
                  disabled={mutation.isPending || question.trim().length < 3}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {mutation.isPending ? "Deliberating…" : "Convene War Room"}
                </button>
              </div>
              {mutation.isError ? (
                <p className="mt-2 text-[11px] text-signal">
                  Deliberation failed. Please retry.
                </p>
              ) : null}
            </GlassPanel>

            {mutation.isPending ? (
              <GlassPanel>
                <div className="mb-4 flex items-center gap-2">
                  <span className="animate-pulse-dot size-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Cross-verifying evidence chains…
                  </span>
                </div>
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="size-9 shrink-0 animate-pulse rounded-full bg-white/5" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
                        <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                        <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            ) : null}

            {result ? (
              <GlassPanel>
                <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Deliberation Transcript
                </h3>
                <div className="space-y-4">
                  {result.turns.map((turn, i) => {
                    const tone = roleTone[turn.role] ?? "primary";
                    const t = toneClass[tone];
                    return (
                      <div key={i} className="flex gap-3">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${t.bg} ${t.border}`}
                        >
                          <span className={`font-mono text-[9px] font-bold ${t.text}`}>
                            {turn.agent
                              .split(" ")
                              .slice(-1)[0]
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-[12px] font-bold">{turn.agent}</span>
                            <span className={`font-mono text-[9px] uppercase ${t.text}`}>
                              {turn.role}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                                turn.stance.toLowerCase().includes("oppose") ||
                                turn.stance.toLowerCase().includes("against")
                                  ? "bg-signal/15 text-signal"
                                  : turn.stance.toLowerCase().includes("support") ||
                                      turn.stance.toLowerCase().includes("agree")
                                    ? "bg-aurora/15 text-aurora"
                                    : "bg-white/5 text-muted-foreground"
                              }`}
                            >
                              {turn.stance}
                            </span>
                            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                              {Math.round(turn.confidence)}%
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] leading-relaxed">{turn.argument}</p>
                          <div className="mt-2 flex items-start gap-2 rounded-md border border-white/5 bg-white/5 p-2">
                            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-aurora" />
                            <span className="text-[10px] text-muted-foreground">
                              <span className="font-bold text-foreground">Evidence: </span>
                              {turn.evidence}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            ) : null}
          </section>

          {/* Right: consensus + approval */}
          <section className="space-y-4 lg:col-span-3">
            <GlassPanel>
              <h4 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Consensus
              </h4>
              {result ? (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-aurora">
                      {Math.round(result.consensus.confidence)}% AGREEMENT
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                        approved === "approved"
                          ? "bg-aurora/15 text-aurora"
                          : approved === "rejected"
                            ? "bg-signal/15 text-signal"
                            : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {approved === "pending" ? "Awaiting Human" : approved.toUpperCase()}
                    </span>
                  </div>
                  <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-aurora"
                      style={{ width: `${result.consensus.confidence}%` }}
                    />
                  </div>
                  <p className="text-[12px] leading-relaxed">
                    {result.consensus.recommendation}
                  </p>
                  <div className="mt-3 rounded-md border border-signal/20 bg-signal/5 p-2">
                    <div className="font-mono text-[9px] uppercase text-signal">Dissent noted</div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {result.consensus.dissent}
                    </p>
                  </div>

                  <h5 className="mb-2 mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Next Steps
                  </h5>
                  <ol className="space-y-1.5">
                    {result.consensus.nextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20 font-mono text-[9px] text-primary">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>

                  {approved === "pending" ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setApproved("approved")}
                        className="rounded-md bg-aurora/20 py-2 text-[11px] font-bold text-aurora ring-1 ring-aurora/30 hover:bg-aurora/30"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setApproved("rejected")}
                        className="rounded-md bg-signal/10 py-2 text-[11px] font-bold text-signal ring-1 ring-signal/30 hover:bg-signal/20"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setApproved("pending")}
                      className="mt-4 w-full rounded-md border border-white/10 bg-white/5 py-1.5 text-[10px] text-muted-foreground hover:bg-white/10"
                    >
                      Reset decision
                    </button>
                  )}
                </>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Consensus will appear here once the war room reaches convergence.
                </p>
              )}
            </GlassPanel>
          </section>
        </div>
      </main>
    </AtlasShell>
  );
}
