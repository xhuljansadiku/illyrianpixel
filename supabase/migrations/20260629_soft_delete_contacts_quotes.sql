-- Fshirje e butë (soft delete) për contacts dhe quotes — "Fshi" te paneli
-- s'i largon më përgjithmonë, vetëm i fsheh. Restore brenda dritares së Trash.
alter table contacts add column if not exists deleted_at timestamptz;
alter table quotes   add column if not exists deleted_at timestamptz;

create index if not exists contacts_deleted_at_idx on contacts (deleted_at);
create index if not exists quotes_deleted_at_idx   on quotes   (deleted_at);
