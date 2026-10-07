alter table newsletter_broadcasts add column if not exists scheduled_for timestamptz;
alter table newsletter_broadcasts add column if not exists sent_at timestamptz;

-- Broadcast-et ekzistuese u dërguan menjëherë në krijim
update newsletter_broadcasts set sent_at = created_at where sent_at is null;
