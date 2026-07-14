import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  goal: z.string().min(3).max(500),
  budgetUsd: z.number().positive().max(1_000_000_000_000),
  timelineYears: z.number().int().min(1).max(50),
  geography: z.string().min(2).max(200),
  constraints: z.string().max(1000).optional().default(""),
  policies: z.string().max(1000).optional().default(""),
});

const StrategySchema = z.object({
  strategies: z.array(
    z.object({
      name: z.string(),
      thesis: z.string(),
      confidence: z.number(),
      expectedRoi: z.string(),
      timeToImpact: z.string(),
      allocation: z.array(z.object({ bucket: z.string(), percent: z.number() })),
      tradeoffs: z.array(z.object({ label: z.string(), value: z.string() })),
      risks: z.array(z.string()),
      evidence: z.array(z.object({ source: z.string(), note: z.string(), confidence: z.number() })),
      forecast: z.array(z.object({ year: z.number(), outcomeIndex: z.number() })),
    }),
  ),
  summary: z.string(),
});

export type StrategyResult = z.infer<typeof StrategySchema>;

export const generateStrategies = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<StrategyResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `You are Atlas Sanctum, a decision intelligence engine.
Generate exactly 3 distinct, comparable strategies for the following decision. Each strategy must have a specific, non-generic name tied to the geography and goal. Confidence values are 0-100 integers. outcomeIndex is a 0-100 restoration/impact index projected per year for ${data.timelineYears} annual points starting at year 1. Allocation percentages should sum to ~100. Provide 3-5 evidence items citing real institutions (ESA, IPCC, World Bank, WHO, FAO, IUCN, Global Forest Watch, NOAA, etc.).

DECISION BRIEF:
Goal: ${data.goal}
Budget: $${data.budgetUsd.toLocaleString()} USD
Timeline: ${data.timelineYears} years
Geography: ${data.geography}
Constraints: ${data.constraints || "none specified"}
Policies: ${data.policies || "none specified"}

Return strategies that meaningfully differ in approach (e.g. aggressive vs. resilient vs. balanced), not variations of the same idea. Keep tradeoffs concrete (e.g. "Local employment: +2,400 jobs", "Carbon seq: 4.2x baseline"). Keep summary under 240 chars.`;

    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
        experimental_output: Output.object({ schema: StrategySchema }),
      });
      return experimental_output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        try {
          return StrategySchema.parse(JSON.parse(error.text ?? "{}"));
        } catch {
          throw new Error("Model returned malformed output. Please retry.");
        }
      }
      throw error;
    }
  });
