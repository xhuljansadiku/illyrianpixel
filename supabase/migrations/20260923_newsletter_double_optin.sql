-- Double opt-in për newsletter-in: broadcast-et dërgohen vetëm te abonentët që kanë
-- klikuar "Konfirmo abonimin" në email. Abonentët ekzistues (para këtij ndryshimi)
-- trajtohen si të konfirmuar që të mos humbasin email-et.
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
alter table newsletter_subscribers add column if not exists confirmed_at timestamptz;

update newsletter_subscribers
   set confirmed_at = coalesce(subscribed_at, now())
 where confirmed_at is null
   and unsubscribed = false
   and subscribed_at < '2026-09-24';
