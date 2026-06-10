-- contact_logs u krijua më parë pa grants për service_role
-- (i njëjti problem si te contact_notes), prandaj historiku s'lexohej kurrë
grant select, insert, update, delete on public.contact_logs to service_role;
grant usage, select on sequence contact_logs_id_seq to service_role;
