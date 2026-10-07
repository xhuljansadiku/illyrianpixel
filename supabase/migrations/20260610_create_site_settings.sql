-- Cilësime të faqes të editueshme nga admini, pa prekur kodin
create table if not exists site_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "service role only"
  on site_settings for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.site_settings to service_role;

insert into site_settings (key, value) values
  ('newsletter_discount_code', 'ILLYRIAN10'),
  ('whatsapp_number', '355694726827')
on conflict (key) do nothing;
