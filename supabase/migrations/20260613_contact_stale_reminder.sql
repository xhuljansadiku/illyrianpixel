alter table contacts add column if not exists stale_reminder_sent_at timestamptz;
