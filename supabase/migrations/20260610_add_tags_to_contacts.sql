-- Etiketa (tags) për kontaktet, p.sh. "VIP", "Urgjent"
alter table contacts
  add column if not exists tags text[] not null default '{}';

create index if not exists contacts_tags_idx on contacts using gin (tags);
