// Shared helpers for seeding guided lessons. Each seed script describes a journey as data.
import { readFileSync } from "node:fs";

const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "content-type": "application/json" };

export const L = (title, body) => ({ kind: "lesson", title, body });
export const P = (title, body) => ({ kind: "prompt", title, body });
export const S = (title, body, options) => ({ kind: "scales", title, body, options });
export const F = (title, body, options) => ({ kind: "fields", title, body, options });
export const C = (title, body, options) => ({ kind: "choice", title, body, options });
export const K = (title, body, options) => ({ kind: "checklist", title, body, options });

async function api(path, init = {}) {
  const r = await fetch(`${BASE}${path}`, { ...init, headers: { ...H, ...(init.headers ?? {}) } });
  if (!r.ok) throw new Error(`${init.method ?? "GET"} ${path}: ${await r.text()}`);
  return r;
}

/**
 * modules: [{ slug, position, title, subtitle, intro, audio?: { path, title, minutes, file? }, steps }]
 * Existing modules are updated, missing ones are created. Steps are replaced (saved answers to them go).
 */
export async function seedJourney(journeySlug, modules, { publish = false } = {}) {
  const j = await (await api(`/rest/v1/journeys?slug=eq.${journeySlug}&select=id`)).json();
  if (!j[0]) throw new Error(`journey ${journeySlug} not found`);
  const journeyId = j[0].id;

  for (const m of modules) {
    const row = {
      slug: m.slug,
      position: m.position,
      title: m.title,
      subtitle: m.subtitle,
      intro: m.intro,
      journey_id: journeyId,
    };
    if (m.audio) {
      if (m.audio.file) {
        await api(`/storage/v1/object/audio/${m.audio.path}`, {
          method: "POST",
          headers: { "content-type": "audio/mpeg", "x-upsert": "true" },
          body: readFileSync(m.audio.file),
        });
      }
      Object.assign(row, {
        audio_path: m.audio.path,
        audio_title: m.audio.title,
        audio_minutes: m.audio.minutes,
        audio_binaural: true,
      });
    }
    if (m.noAudio) Object.assign(row, { audio_path: null, audio_title: null, audio_minutes: null, audio_binaural: false });

    const found = await (await api(`/rest/v1/modules?slug=eq.${m.slug}&select=id`)).json();
    let id = found[0]?.id;
    if (id) {
      await api(`/rest/v1/modules?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
    } else {
      const created = await (
        await api(`/rest/v1/modules`, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ...row, is_free: false }) })
      ).json();
      id = created[0].id;
    }

    await api(`/rest/v1/exercises?module_id=eq.${id}`, { method: "DELETE" });
    const steps = m.steps.map((s, i) => ({
      module_id: id,
      position: i + 1,
      kind: s.kind,
      title: s.title,
      body: s.body ?? null,
      options: s.options ?? null,
    }));
    await api(`/rest/v1/exercises`, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(steps) });
    console.log(m.slug.padEnd(24), String(steps.length).padStart(2), "steps,", steps.filter((s) => s.kind === "lesson").length, "lessons");
  }

  if (publish) {
    await api(`/rest/v1/journeys?id=eq.${journeyId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ is_published: true }) });
    console.log(`${journeySlug} published`);
  }
}
