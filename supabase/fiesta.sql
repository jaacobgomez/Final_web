-- Fiesta con votos · Taste Mixer
-- Pegar entero en Supabase → SQL Editor → Run. Se puede volver a ejecutar sin problema.

-- 1) Tablas ---------------------------------------------------------------

create table if not exists public.fiestas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,               -- lo que se comparte: PERLA-42
  nombre text not null,
  votos_por_persona int not null default 3 check (votos_por_persona between 1 and 10),
  creada timestamptz not null default now(),
  caduca timestamptz not null default now() + interval '24 hours'
);

-- La clave del anfitrión va aparte: los móviles de los invitados no pueden leerla
create table if not exists public.fiestas_secretos (
  fiesta_id uuid primary key references public.fiestas (id) on delete cascade,
  clave_anfitrion_hash text not null
);

create table if not exists public.canciones (
  id bigint generated always as identity primary key,
  fiesta_id uuid not null references public.fiestas (id) on delete cascade,
  track_id text not null,
  datos jsonb not null,                       -- nombre, artistas, carátula, uri, duración, explícita
  en_base boolean not null default false,     -- venía en la lista inicial del anfitrión
  posicion_base int,                          -- su orden en esa lista
  propuesta_por text,                         -- nombre del invitado que la añadió
  creada timestamptz not null default now(),
  unique (fiesta_id, track_id)
);

create table if not exists public.votos (
  cancion_id bigint not null references public.canciones (id) on delete cascade,
  fiesta_id uuid not null references public.fiestas (id) on delete cascade,
  invitado_id text not null,                  -- id aleatorio guardado en su móvil
  nombre text not null,
  creada timestamptz not null default now(),
  primary key (cancion_id, invitado_id)       -- un voto por persona y canción
);

create index if not exists canciones_fiesta on public.canciones (fiesta_id);
create index if not exists votos_fiesta_invitado on public.votos (fiesta_id, invitado_id);

-- 2) Máximo de votos por persona (lo comprueba la base de datos, no se puede saltar)

create or replace function public.comprobar_votos() returns trigger
language plpgsql as $$
declare
  maximo int;
  usados int;
begin
  select votos_por_persona into maximo from public.fiestas where id = new.fiesta_id;
  select count(*) into usados from public.votos
    where fiesta_id = new.fiesta_id and invitado_id = new.invitado_id;
  if usados >= maximo then
    raise exception 'SIN_VOTOS' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists limite_votos on public.votos;
create trigger limite_votos before insert on public.votos
  for each row execute function public.comprobar_votos();

-- 3) Seguridad: los invitados solo pueden LEER fiestas vigentes.
--    Todo lo que escribe pasa por la API de la app con la clave secreta.

alter table public.fiestas enable row level security;
alter table public.fiestas_secretos enable row level security;
alter table public.canciones enable row level security;
alter table public.votos enable row level security;

drop policy if exists "leer fiestas vigentes" on public.fiestas;
create policy "leer fiestas vigentes" on public.fiestas
  for select to anon, authenticated using (caduca > now());

drop policy if exists "leer canciones" on public.canciones;
create policy "leer canciones" on public.canciones
  for select to anon, authenticated
  using (exists (select 1 from public.fiestas f where f.id = fiesta_id and f.caduca > now()));

drop policy if exists "leer votos" on public.votos;
create policy "leer votos" on public.votos
  for select to anon, authenticated
  using (exists (select 1 from public.fiestas f where f.id = fiesta_id and f.caduca > now()));

-- fiestas_secretos: sin políticas = nadie desde el navegador

-- 4) Tiempo real: avisar a los móviles cuando cambian canciones o votos

alter table public.votos replica identity full;      -- para saber qué voto se ha quitado
alter table public.canciones replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table public.canciones;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.votos;
  exception when duplicate_object then null;
  end;
end;
$$;
