/**
 * check-inactivity
 *
 * Daily cron endpoint.  Finds users inactive for 10+ days and sends
 * win-back emails.  Also sends a follow-up 7 days later if still inactive.
 *
 * Triggered by:  node-cron in server.js  (daily at 08:00 UTC)
 *             or: Supabase Dashboard → Edge Functions → Schedule
 *
 * POST body:  { source?: string }   (informational only)
 *
 * Required secret: SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, SUPA_URL, SUPA_SERVICE_KEY } from "../_shared/mailer.ts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserRow {
  id:               string;
  email:            string;
  raw_user_meta_data: { name?: string } | null;
  last_sign_in_at:  string | null;
}

interface WinbackRow {
  user_id:        string;
  first_sent_at:  string | null;
  second_sent_at: string | null;
  unsubscribed:   boolean;
}

interface ProgressRow {
  user_id:    string;
  updated_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysSince(iso: string | null): number {
  if (!iso) return 999;
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

/** Call another edge function in the same project. */
async function callEdge(name: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${SUPA_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPA_SERVICE_KEY}`,
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** REST query against Supabase with service role. */
async function supaQuery<T>(path: string, params = ""): Promise<T[]> {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}${params}`, {
    headers: {
      "apikey":        SUPA_SERVICE_KEY,
      "Authorization": `Bearer ${SUPA_SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Supabase query failed (${path}): ${err}`);
  }
  return res.json() as Promise<T[]>;
}

/** Upsert a row via Supabase REST. */
async function supaUpsert(table: string, data: unknown): Promise<void> {
  await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey":        SUPA_SERVICE_KEY,
      "Authorization": `Bearer ${SUPA_SERVICE_KEY}`,
      "Content-Type":  "application/json",
      "Prefer":        "resolution=merge-duplicates",
    },
    body: JSON.stringify(data),
  });
}

// ── Handler ───────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  if (!SUPA_SERVICE_KEY) {
    console.error("check-inactivity: SUPABASE_SERVICE_ROLE_KEY not set");
    return new Response(
      JSON.stringify({ error: "Service key not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const started = Date.now();
  const stats   = { checked: 0, first_sent: 0, followup_sent: 0, skipped: 0, errors: 0 };

  try {
    // ── 1. Fetch all auth users (requires service role) ───────────────────────
    const users = await supaQuery<UserRow>(
      "auth/users",
      "?select=id,email,raw_user_meta_data,last_sign_in_at&limit=1000",
    ).catch(() => [] as UserRow[]);

    // ── 2. Fetch existing winback tracking rows ───────────────────────────────
    const winbackRows = await supaQuery<WinbackRow>(
      "winback_tracking",
      "?select=user_id,first_sent_at,second_sent_at,unsubscribed",
    ).catch(() => [] as WinbackRow[]);

    const winbackMap = new Map<string, WinbackRow>(winbackRows.map(r => [r.user_id, r]));

    // ── 3. Fetch latest user_progress updated_at ──────────────────────────────
    const progress = await supaQuery<ProgressRow>(
      "user_progress",
      "?select=user_id,updated_at",
    ).catch(() => [] as ProgressRow[]);

    const progressMap = new Map<string, string>(progress.map(r => [r.user_id, r.updated_at]));

    // ── 4. Evaluate each user ─────────────────────────────────────────────────
    for (const user of users) {
      stats.checked++;

      // Use most-recent of last_sign_in_at and user_progress.updated_at
      const lastSignIn   = user.last_sign_in_at;
      const lastProgress = progressMap.get(user.id) ?? null;
      const mostRecent   = [lastSignIn, lastProgress]
        .filter(Boolean)
        .sort()
        .pop() ?? null;

      const daysAway = daysSince(mostRecent);

      // Skip users who've been active recently
      if (daysAway < 10) { stats.skipped++; continue; }

      const wb = winbackMap.get(user.id);

      // Skip unsubscribed users
      if (wb?.unsubscribed) { stats.skipped++; continue; }

      const name = user.raw_user_meta_data?.name || user.email.split("@")[0];

      // ── First win-back (10+ days inactive, never emailed or last email >14 days ago)
      if (!wb?.first_sent_at || daysSince(wb.first_sent_at) > 14) {
        const ok = await callEdge("send-winback-email", {
          email:      user.email,
          name,
          days_away:  Math.round(daysAway),
          is_followup: false,
        });

        if (ok) {
          await supaUpsert("winback_tracking", {
            user_id:       user.id,
            first_sent_at: new Date().toISOString(),
          });
          stats.first_sent++;
        } else {
          stats.errors++;
        }
        continue;
      }

      // ── Follow-up (7+ days after first email, still inactive, no second email yet)
      const daysSinceFirst = daysSince(wb.first_sent_at);
      if (daysSinceFirst >= 7 && !wb.second_sent_at) {
        const ok = await callEdge("send-winback-email", {
          email:       user.email,
          name,
          days_away:   Math.round(daysAway),
          is_followup: true,
        });

        if (ok) {
          await supaUpsert("winback_tracking", {
            user_id:        user.id,
            second_sent_at: new Date().toISOString(),
          });
          stats.followup_sent++;
        } else {
          stats.errors++;
        }
        continue;
      }

      stats.skipped++;
    }

    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`[check-inactivity] Done in ${elapsed}s:`, stats);

    return new Response(
      JSON.stringify({ ok: true, elapsed_s: parseFloat(elapsed), ...stats }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("check-inactivity error:", msg);
    return new Response(
      JSON.stringify({ error: msg, partial_stats: stats }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
