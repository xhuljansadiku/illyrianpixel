-- rate_limits u krijua më parë pa grants për service_role
-- (i njëjti problem si te contact_logs/contact_notes), prandaj rate limiting
-- i formularit të kontaktit dështonte në heshtje (fail-open) — checkRateLimit()
-- merrte error te SELECT/INSERT dhe lejonte kërkesën pa limit.
grant select, insert, delete on public.rate_limits to service_role;
