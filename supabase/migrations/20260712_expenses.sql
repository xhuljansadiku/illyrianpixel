-- Shpenzimet e biznesit — për t'u parë krah të ardhurave (fatura + rekurrencë)
-- te tab-i i ri "Financat" dhe për të llogaritur fitimin neto.
create table if not exists expenses (
  id           bigint generated always as identity primary key,
  description  text        not null,
  category     text        not null default 'Tjetër',
  amount       numeric      not null,
  expense_date date        not null,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists expenses_date_idx on expenses (expense_date desc);
create index if not exists expenses_category_idx on expenses (category);

alter table expenses enable row level security;

drop policy if exists "service role only" on expenses;
create policy "service role only"
  on expenses for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.expenses to service_role;
grant usage, select on sequence expenses_id_seq to service_role;
