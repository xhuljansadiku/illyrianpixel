-- Përdorimi i një kodi rezervë (2FA) ishte read-modify-write në kod (JS): dy kërkesa
-- njëkohshme me të njëjtin kod mund të lexonin "used: false" para se ndonjëra të
-- shkruante, duke lejuar përdorimin e të njëjtit kod dy herë. Kjo funksion e bën
-- verifikimin + shënimin "used" atomik, brenda një transaksioni të vetëm SQL, me
-- "select ... for update" që kyç rreshtin dhe serializon kërkesat njëkohshme.
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
create or replace function consume_recovery_code(p_code_hash text)
returns boolean
language plpgsql
as $$
declare
  v_codes jsonb;
  v_idx   int;
begin
  select value::jsonb into v_codes
  from site_settings
  where key = 'totp_recovery_codes'
  for update;

  if v_codes is null then
    return false;
  end if;

  select (ord - 1) into v_idx
  from jsonb_array_elements(v_codes) with ordinality as t(elem, ord)
  where elem->>'hash' = p_code_hash
    and coalesce((elem->>'used')::boolean, false) = false
  limit 1;

  if v_idx is null then
    return false;
  end if;

  update site_settings
  set value = jsonb_set(v_codes, array[v_idx::text, 'used'], 'true'::jsonb)::text,
      updated_at = now()
  where key = 'totp_recovery_codes';

  return true;
end;
$$;

grant execute on function consume_recovery_code(text) to service_role;
