/*
  Waitlist persistence.

  Talks to PostgREST directly rather than pulling in @supabase/supabase-js:
  this is one INSERT on a marketing page, and the SDK would cost more bundle
  than the entire rest of the route.

  The table is insert-only for the public key — see supabase/waitlist_signups.sql.
  Nothing here can read the list back, by design.
*/

export type SignupSource = "main_form" | "sticky_bar";

export type SignupResult =
  | "saved" // new row landed
  | "duplicate" // already on the list, which is a success from the visitor's side
  | "unconfigured" // env vars missing — local dev without .env.local
  | "failed"; // network or server error; logged, never shown to the visitor

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Lowercased and trimmed so the table's unique constraint dedupes by identity, not by casing. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function saveSignup(rawEmail: string, source: SignupSource): Promise<SignupResult> {
  const email = normalizeEmail(rawEmail);
  if (!email) return "failed";

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "[waitlist] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are unset — signup not persisted.",
    );
    return "unconfigured";
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_signups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // The anon role has no SELECT on this table, so never ask for the row back.
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email, source }),
    });

    if (res.ok) return "saved";

    // Unique violation: they are already on the list. Not an error to a visitor.
    if (res.status === 409) return "duplicate";

    const body = await res.text().catch(() => "");
    if (body.includes("23505")) return "duplicate";

    console.error(`[waitlist] insert failed (${res.status}): ${body.slice(0, 300)}`);
    return "failed";
  } catch (err) {
    console.error("[waitlist] insert threw:", err);
    return "failed";
  }
}
