-- Fusha anglisht për përmbajtjen publike të menaxhuar nga admini.
-- Shqipja mbetet gjuha bazë (kolonat ekzistuese); kolonat *_en janë opsionale.
-- Në /en shfaqen vetëm rreshtat që kanë përkthimin kryesor të plotësuar.

alter table testimonials add column if not exists quote_en text;
alter table testimonials add column if not exists result_en text;
alter table testimonials add column if not exists category_en text;

alter table portfolio_items add column if not exists category_en text;
alter table portfolio_items add column if not exists location_en text;
alter table portfolio_items add column if not exists description_en text;
alter table portfolio_items add column if not exists result_en text;

alter table faqs add column if not exists question_en text;
alter table faqs add column if not exists answer_en text;
alter table faqs add column if not exists category_en text;

-- site_settings s'ka nevojë për ndryshim skeme: çelësat popup_*_en
-- ruhen si rreshta të rinj key/value nga paneli i adminit.
