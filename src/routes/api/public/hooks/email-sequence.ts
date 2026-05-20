import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { enqueueTransactionalEmailAsService } from "@/server/email.server";

// Step → days after last_emailed_at when the next email becomes due.
// Step 1 is sent inline by the purchase webhook. This processor handles 2..7.
const STEP_DELAY_DAYS: Record<number, number> = {
  2: 2,
  3: 4,
  4: 6,
  5: 9,
  6: 12,
  7: 16,
};

function delayForStep(stepToSend: number): number {
  // To send step N, we wait STEP_DELAY_DAYS[N] - STEP_DELAY_DAYS[N-1] days
  // since last_emailed_at. Simpler: from the perspective of "next due",
  // compute total days since subscribed_at. We use last_emailed_at as the
  // anchor: gap between steps.
  const gaps: Record<number, number> = { 2: 2, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4 };
  return gaps[stepToSend] ?? 0;
}

export const Route = createFileRoute("/api/public/hooks/email-sequence")({
  server: {
    handlers: {
      POST: async () => {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
          return new Response("config", { status: 500 });
        }
        const supabase = createClient(url, key);

        // Pull active subscribers who haven't completed step 7 yet.
        const { data: subs, error } = await supabase
          .from("email_subscribers")
          .select("id, email, first_name, sequence_step, sequence_paused, last_emailed_at, product_slug")
          .eq("sequence_paused", false)
          .lt("sequence_step", 7)
          .limit(200);

        if (error) {
          console.error("email-sequence query error", error);
          return new Response("query error", { status: 500 });
        }

        const now = Date.now();
        let processed = 0;
        let sent = 0;

        for (const sub of subs ?? []) {
          processed++;
          const currentStep = Number(sub.sequence_step ?? 1);
          const nextStep = currentStep + 1;
          if (nextStep < 2 || nextStep > 7) continue;

          const last = sub.last_emailed_at ? new Date(sub.last_emailed_at).getTime() : 0;
          const dueAt = last + delayForStep(nextStep) * 24 * 60 * 60 * 1000;
          if (now < dueAt) continue;

          try {
            const result = await enqueueTransactionalEmailAsService({
              templateName: "nurture-sequence",
              recipientEmail: sub.email as string,
              idempotencyKey: `nurture-${sub.id}-${nextStep}`,
              templateData: {
                step: nextStep,
                first_name: sub.first_name ?? undefined,
              },
            });

            if (result.success || result.reason === "suppressed") {
              await supabase
                .from("email_subscribers")
                .update({
                  sequence_step: nextStep,
                  last_emailed_at: new Date().toISOString(),
                  sequence_paused: nextStep >= 7 ? true : false,
                })
                .eq("id", sub.id as string);
              await supabase.from("email_sequence_log").insert({
                subscriber_id: sub.id as string,
                step: nextStep,
                template_name: "nurture-sequence",
              });
              sent++;
            }
          } catch (e) {
            console.error("nurture send failed", sub.email, (e as Error).message);
          }
        }

        return Response.json({ processed, sent });
      },
    },
  },
});
