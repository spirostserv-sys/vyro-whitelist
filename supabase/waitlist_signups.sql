-- ============================================================
-- waitlist_signups — pre-launch email capture for the landing page
-- ============================================================
-- Lives in the SAME Supabase project as the VYRO app
-- (tizrsxyzhjplysuqrumd), so everything stays in one dashboard.
--
-- Run this once in the Supabase SQL Editor. It is idempotent — re-running
-- it is safe.
--
-- SECURITY NOTE, the important part of this file:
-- the landing page is public and ships the publishable (anon) key in the
-- browser, so anyone can read that key and call this table. The design
-- below assumes that:
--   * anon may INSERT     — that is the signup itself
--   * anon may NOT SELECT — nobody can dump the collected email list
--   * anon may NOT UPDATE/DELETE
-- RLS denies anything without a matching policy, and the only policy here
-- is for insert. You read the list through the dashboard (or any
-- service_role connection), which bypasses RLS.

create table if not exists public.waitlist_signups (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null unique,
  source     text        not null default 'main_form',
  created_at timestamptz not null default now()
);

-- Emails are normalised to lowercase by the client before insert, so the
-- plain unique constraint above also dedupes "Spiro@X.com" vs "spiro@x.com".
-- This index makes that guarantee hold even for rows inserted by hand.
create unique index if not exists waitlist_signups_email_lower_idx
  on public.waitlist_signups (lower(email));

create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);

-- A public insert endpoint is a public write endpoint: constrain what can
-- land in it so it cannot be used as free-form storage.
alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_email_shape;
alter table public.waitlist_signups
  add constraint waitlist_signups_email_shape
  check (length(email) between 3 and 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_source_allowed;
alter table public.waitlist_signups
  add constraint waitlist_signups_source_allowed
  check (source in ('main_form', 'sticky_bar'));

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.waitlist_signups enable row level security;

-- Anyone may put themselves on the list. This is the only thing the public
-- key can do to this table.
drop policy if exists "anyone may join the waitlist" on public.waitlist_signups;
create policy "anyone may join the waitlist"
  on public.waitlist_signups for insert
  to anon, authenticated
  with check (true);

-- No select/update/delete policy exists on purpose: with RLS on, that means
-- the collected list is unreadable to anon and authenticated alike.
revoke select, update, delete on public.waitlist_signups from anon, authenticated;
grant insert on public.waitlist_signups to anon, authenticated;
