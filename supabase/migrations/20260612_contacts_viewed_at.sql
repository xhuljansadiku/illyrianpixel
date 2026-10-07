-- Shenjon kontaktet "I RI" / "E LEXUAR" në panelin admin
alter table contacts
  add column if not exists viewed_at timestamptz;
