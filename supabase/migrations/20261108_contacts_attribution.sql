-- Burimi i kërkesës: nga erdhi vizitori që plotësoi formularin (2026-11-08).
-- Vetëm shtesë, të gjitha opsionale: kërkesat ekzistuese dhe kodi aktual s'preken.
alter table contacts
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists click_source text,
  add column if not exists landing_path text,
  add column if not exists referrer_host text;
