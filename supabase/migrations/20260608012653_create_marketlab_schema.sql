-- ────────────────────────────────────────────────────────────
-- MarketLab schema
-- ────────────────────────────────────────────────────────────

-- ────────────────────────────────────────
-- Enums
-- ────────────────────────────────────────
create type market_status as enum ('open', 'closed', 'resolved');

-- ────────────────────────────────────────
-- profiles
-- One row per auth user. Balance is managed server-side only.
-- ────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  first_name    text not null default '',
  last_name     text not null default '',
  balance_cents integer not null default 10000, -- $100.00 starting balance
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner read"
  on public.profiles for select
  using (auth.uid() = id);

-- No UPDATE policy — balance changes happen through server-side RPC only.

-- ────────────────────────────────────────
-- markets
-- Binary Yes/No markets.
-- ────────────────────────────────────────
create table public.markets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      market_status not null default 'open',
  close_date  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.markets enable row level security;

create policy "markets: public read"
  on public.markets for select
  using (true);

-- ────────────────────────────────────────
-- positions
-- One row per (user, market) pair. 1 fake cent = 1 share cent.
-- ────────────────────────────────────────
create table public.positions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  market_id        uuid not null references public.markets on delete cascade,
  yes_shares_cents integer not null default 0,
  no_shares_cents  integer not null default 0,
  invested_cents   integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, market_id)
);

alter table public.positions enable row level security;

create policy "positions: owner read"
  on public.positions for select
  using (auth.uid() = user_id);

-- ────────────────────────────────────────
-- ledger_entries
-- Append-only record of all balance changes.
-- ────────────────────────────────────────
create table public.ledger_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  market_id    uuid references public.markets on delete set null,
  amount_cents integer not null,
  entry_type   text not null,
  description  text,
  created_at   timestamptz not null default now()
);

alter table public.ledger_entries enable row level security;

create policy "ledger_entries: owner read"
  on public.ledger_entries for select
  using (auth.uid() = user_id);

-- ────────────────────────────────────────
-- Auto-create profile on signup
-- ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
