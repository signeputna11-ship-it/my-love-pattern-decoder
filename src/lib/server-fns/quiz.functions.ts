import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { JOURNEYS, QUIZ, scoreAnswers, type JourneyKey } from "@/lib/quiz";

export const CONSENT_TEXT =
  "I would like to receive guidance and offers from Signe Coach by email. I can unsubscribe at any time.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const submitQuiz = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { answers: number[]; email: string; firstName?: string; marketingConsent: boolean; website?: string }) => {
      if (!Array.isArray(d.answers) || d.answers.length !== QUIZ.length) throw new Error("Invalid answers");
      const email = String(d.email ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254) throw new Error("Please enter a valid email");
      const firstName = String(d.firstName ?? "").trim().slice(0, 60);
      return { answers: d.answers.map(Number), email, firstName, marketingConsent: !!d.marketingConsent, website: String(d.website ?? "") };
    },
  )
  .handler(async ({ data }) => {
    const result = scoreAnswers(data.answers);
    if (!result) throw new Error("Invalid answers");
    const reply = { primary: result.primary, secondary: result.secondary };
    // Honeypot: bots fill the hidden field. Answer normally but store nothing.
    if (data.website) return reply;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("quiz_leads" as never)
      .select("marketing_consent, consent_text, consent_at")
      .eq("email", data.email)
      .maybeSingle();
    const prev = existing as { marketing_consent: boolean; consent_text: string | null; consent_at: string | null } | null;
    const consent = data.marketingConsent || !!prev?.marketing_consent;
    const newlyConsented = data.marketingConsent && !prev?.marketing_consent;

    const { error } = await supabaseAdmin.from("quiz_leads" as never).upsert(
      {
        email: data.email,
        first_name: data.firstName || null,
        answers: data.answers,
        scores: result.scores,
        primary_journey: result.primary,
        secondary_journey: result.secondary,
        marketing_consent: consent,
        consent_text: newlyConsented ? CONSENT_TEXT : prev?.consent_text ?? null,
        consent_at: newlyConsented ? new Date().toISOString() : prev?.consent_at ?? null,
      } as never,
      { onConflict: "email" },
    );
    if (error) {
      console.error("submitQuiz failed", error.message);
      throw new Error("We could not save your result. Please try again.");
    }
    return reply;
  });

/** For a signed-in user: link their quiz result (matched by email) and return their starting point. */
export const getMyStartingPoint = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    const email = u?.user?.email?.toLowerCase();
    if (!email) return { primary: null as JourneyKey | null, secondary: null as JourneyKey | null };
    const { data } = await supabaseAdmin
      .from("quiz_leads" as never)
      .select("primary_journey, secondary_journey")
      .eq("email", email)
      .maybeSingle();
    const row = data as { primary_journey: string; secondary_journey: string | null } | null;
    if (!row || !(row.primary_journey in JOURNEYS)) return { primary: null as JourneyKey | null, secondary: null as JourneyKey | null };
    await supabaseAdmin.from("quiz_leads" as never).update({ user_id: context.userId } as never).eq("email", email);
    await supabaseAdmin.from("profiles").update({ starting_journey: row.primary_journey } as never).eq("user_id", context.userId);
    return { primary: row.primary_journey as JourneyKey, secondary: (row.secondary_journey as JourneyKey | null) ?? null };
  });
