-- ════════════════════════════════════════════════════════════════════════════
-- Portal i klientit: link unik (/klienti/[token]) për të parë statusin e
-- projektit + ofertat/faturat e tij.
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
-- ════════════════════════════════════════════════════════════════════════════

alter table contacts
  add column if not exists portal_token text;

update contacts set portal_token = replace(gen_random_uuid()::text, '-', '')
where portal_token is null;

alter table contacts
  alter column portal_token set default replace(gen_random_uuid()::text, '-', ''),
  alter column portal_token set not null;

create unique index if not exists contacts_portal_token_idx on contacts (portal_token);
