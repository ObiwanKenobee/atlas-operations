import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  question: z.string().min(3).max(500),
});

const DebateSchema = z.object({
  turns: z.array(
    z.object({
      agent: z.string(),
      role: z.string(),
      stance: z.string(),
      argument: z.string(),
      evidence: z.string(),
      confidence: z.number(),
    }),
  ),
  consensus: z.object({
    recommendation: z.string(),
    confidence: z.number(),
    dissent: z.string(),
    nextSteps: z.array(z.string()),
  }),
});

export type DebateResult = z.infer<typeof DebateSchema>;

export const runDebate = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<DebateResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `You are orchestrating Atlas Sanctum's multi-agent war room. Simulate a real deliberation between 6 specialized agents on the question below. Each agent must genuinely challenge or support prior turns — do NOT let them all agree. Confidence is 0-100.

AGENTS: Ecology Agent (Dr. Aris Thorne), Finance Agent (Marcus Chen), Policy Agent (Sarah Grewal), Climate Agent (Nadia Okafor), Risk Agent (Sentinel-1 AI), Health Agent (Dr. Elena Vasquez).

QUESTION: "${data.question}"

Produce 6-8 debate turns showing genuine disagreement, then a consensus with dissent noted. Evidence must cite real sources (IPCC AR6, ESA Sentinel-2, WHO GBD, World Bank data, IEA WEO, etc.). Keep each argument 2-3 sentences.`;

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
        output: Output.object({ schema: DebateSchema }),
      });
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        try {
          return DebateSchema.parse(JSON.parse(error.text ?? "{}"));
        } catch {
          throw new Error("Model returned malformed output. Please retry.");
        }
      }
      throw error;
    }
  });
