// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are a structured self-reflection guide inside a relationship-pattern workbook app.

Hard rules. Never break:
- You are NOT a therapist. Do NOT diagnose. Do NOT label conditions (e.g. "anxious attachment", "narcissist", "BPD", "trauma response").
- Do NOT make medical, psychological, or mental-health claims.
- Do NOT open a chat. You return ONE structured reflection only, via the provided tool.
- Use the user's own words and the data given. Stay grounded. No speculation about people not described.
- Tone: calm, descriptive, kind, concrete. Never preachy.
- If the user mentions self-harm, abuse, or being in danger: keep "noticing" brief and non-clinical, set next_step to "Reach out to a licensed professional or local support line", and set recommended_resource_id to null.
- Length limits: noticing = 2 to 3 sentences, supportive direct grounded tone. question = ONE sentence ending with a question mark. next_step = 1 to 2 short sentences, concrete and doable.
- Arrays: max 5 items each, each item 2 to 6 words, lowercase fragments.
- Recommend a kit resource only when one is genuinely a fit for what the user wrote. Otherwise return recommended_resource_id: null.

You will receive: the user's pattern type, the current module, their saved answers in this module, the slugs of completed and available modules, and the available kit_resources for this module. Pick recommended_resource_id from available_kit_resources[].id only (or null).`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "Not authenticated" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const PUB_KEY =
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY") ??
      "";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);

    const userClient = createClient(SUPABASE_URL, PUB_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Not authenticated" }, 401);
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const moduleSlug: string | undefined = body?.moduleSlug;
    if (!moduleSlug) return json({ error: "moduleSlug required" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const [
      { data: profile },
      { data: mod },
      { data: allModules },
      { data: progress },
      { data: existingMemory },
    ] = await Promise.all([
      admin.from("profiles").select("pattern_type, display_name").eq("user_id", userId).maybeSingle(),
      admin.from("modules").select("id, slug, title, subtitle").eq("slug", moduleSlug).maybeSingle(),
      admin.from("modules").select("id, slug, title, position").order("position"),
      admin.from("user_progress").select("module_id, completed_at").eq("user_id", userId),
      admin.from("ai_memory").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    if (!mod) return json({ error: "Module not found" }, 404);

    const SLUG_TO_MODULE_KEY: Record<string, string> = {
      "see-the-pattern": "pattern",
      "calm-the-trigger": "trigger",
      "rebuild-self-worth": "self-worth",
      "set-the-boundary": "boundary",
      "decide-differently": "decisions",
    };
    const toolModuleKey = SLUG_TO_MODULE_KEY[moduleSlug] ?? moduleSlug;

    const [{ data: exercises }, { data: answers }, { data: availableTools }] = await Promise.all([
      admin.from("exercises").select("id, title, kind, body, position").eq("module_id", (mod as any).id).order("position"),
      admin.from("user_answers").select("exercise_id, answer_text, answer_data").eq("user_id", userId),
      admin.from("tools").select("id, slug, title, description, kind, order_index").eq("module", toolModuleKey).order("order_index"),
    ]);

    const answerMap = new Map<string, any>();
    (answers ?? []).forEach((a: any) => answerMap.set(a.exercise_id, a));

    const moduleAnswers = (exercises ?? [])
      .map((ex: any) => {
        const a = answerMap.get(ex.id);
        let response = "";
        if (a?.answer_text) response = String(a.answer_text).trim();
        else if (a?.answer_data && Array.isArray(a.answer_data)) response = `Selected: ${a.answer_data.join(", ")}`;
        return { title: ex.title, kind: ex.kind, prompt: ex.body, response };
      })
      .filter((x: any) => x.response.length > 0);

    if (moduleAnswers.length === 0) {
      return json({
        empty: true,
        message: "Complete at least one answer first so your guide has something real to read.",
      });
    }

    const idToSlug = new Map<string, string>();
    (allModules ?? []).forEach((m: any) => idToSlug.set(m.id, m.slug));
    const completedSlugList = (progress ?? [])
      .filter((p: any) => p.completed_at)
      .map((p: any) => idToSlug.get(p.module_id))
      .filter(Boolean);

    const availableNext = (allModules ?? [])
      .map((m: any) => m.slug)
      .filter((s: string) => s !== moduleSlug);

    const userContext = {
      pattern_type: profile?.pattern_type ?? "unknown",
      current_module: { slug: (mod as any).slug, title: (mod as any).title, subtitle: (mod as any).subtitle },
      completed_modules: completedSlugList,
      available_next_modules: availableNext,
      available_tools: (availableTools ?? []).map((r: any) => ({
        slug: r.slug,
        title: r.title,
        description: r.description,
        kind: r.kind,
      })),
      previous_memory: existingMemory
        ? {
            key_triggers: (existingMemory as any).key_triggers ?? [],
            repeated_behaviors: (existingMemory as any).repeated_behaviors ?? [],
            boundaries_needed: (existingMemory as any).boundaries_needed ?? [],
          }
        : null,
      answers_in_this_module: moduleAnswers,
    };

    const validToolSlugs = (availableTools ?? []).map((r: any) => r.slug as string);
    const toolSlugEnum: (string | null)[] =
      validToolSlugs.length > 0 ? [...validToolSlugs, null] : [null];

    const tool = {
      type: "function",
      function: {
        name: "return_pattern_reflection",
        description: "Return one structured pattern reflection.",
        parameters: {
          type: "object",
          properties: {
            noticing: {
              type: "string",
              description: "2-3 grounded sentences about the repeated pattern. Supportive, direct, no diagnosis, no therapy claims. Use the user's own words.",
            },
            question: { type: "string", description: "ONE focused follow-up question." },
            next_step: { type: "string", description: "ONE practical next step the user can take this week." },
            recommended_tool_slug: {
              type: ["string", "null"],
              description: "Slug of ONE tool from available_tools, or null if none fits.",
              enum: toolSlugEnum,
            },
            key_triggers: { type: "array", items: { type: "string" }, maxItems: 5 },
            repeated_behaviors: { type: "array", items: { type: "string" }, maxItems: 5 },
            boundaries_needed: { type: "array", items: { type: "string" }, maxItems: 5 },
          },
          required: [
            "noticing",
            "question",
            "next_step",
            "recommended_tool_slug",
            "key_triggers",
            "repeated_behaviors",
            "boundaries_needed",
          ],
          additionalProperties: false,
        },
      },
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: "Reflect on this user's saved answers and return ONE structured reflection.\n\n" + JSON.stringify(userContext, null, 2) },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "return_pattern_reflection" } },
      }),
    });

    if (aiRes.status === 429) return json({ error: "Too many requests. Try again in a moment." }, 429);
    if (aiRes.status === 402) return json({ error: "AI credits exhausted. Please contact support." }, 402);
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("Gateway error", aiRes.status, t);
      return json({ error: "AI gateway error" }, 500);
    }

    const aiJson = await aiRes.json();
    const call = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      console.error("No tool call", JSON.stringify(aiJson).slice(0, 500));
      return json({ error: "AI returned no structured output" }, 500);
    }
    const parsed = JSON.parse(call.function.arguments);

    const merge = (a: string[] = [], b: string[] = []) =>
      Array.from(new Set([...a, ...b].map((s: string) => s.trim()).filter(Boolean))).slice(0, 12);
    const mergedTriggers = merge((existingMemory as any)?.key_triggers ?? [], parsed.key_triggers ?? []);
    const mergedBehaviors = merge((existingMemory as any)?.repeated_behaviors ?? [], parsed.repeated_behaviors ?? []);
    const mergedBoundaries = merge((existingMemory as any)?.boundaries_needed ?? [], parsed.boundaries_needed ?? []);
    const mergedNextSteps = merge((existingMemory as any)?.next_steps ?? [], [parsed.next_step]);

    const memoryRow = {
      user_id: userId,
      pattern_type: profile?.pattern_type ?? (existingMemory as any)?.pattern_type ?? null,
      key_triggers: mergedTriggers,
      repeated_behaviors: mergedBehaviors,
      boundaries_needed: mergedBoundaries,
      next_steps: mergedNextSteps,
      last_module_slug: moduleSlug,
      last_noticing: parsed.noticing,
      last_question: parsed.question,
      summary: parsed.noticing,
      recommended_next: parsed.recommended_tool_slug ?? parsed.next_step ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertErr } = await admin.from("ai_memory").upsert(memoryRow, { onConflict: "user_id" });
    if (upsertErr) console.error("Memory upsert error", upsertErr);

    return json({ ...parsed, empty: false });
  } catch (e) {
    console.error("ai-pattern-guide error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
