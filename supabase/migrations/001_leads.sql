-- Leads captured by the website contact form.
-- Run this in the Supabase SQL editor (or with `supabase db push`).

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'proposal', 'won', 'lost');
exception when duplicate_object then null;
end $$;

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        lead_status not null default 'new',

  -- what they told us
  name          text not null,
  email         text not null,
  phone         text,
  company       text,
  services      text[] not null default '{}',
  budget        text,
  package       text,
  message       text not null,
  consent_at    timestamptz not null,

  -- how they found us (first touch in that browser session)
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,
  referrer      text,
  landing_page  text,
  first_seen_at timestamptz,
  user_agent    text,

  -- your notes while working the lead
  notes         text,
  value_eur     numeric(12, 2),
  updated_at    timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_email_idx on public.leads (lower(email));

-- Keep updated_at fresh
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- Lock the table down: only the server (service role key) can read or write.
-- No anon/public policies are created on purpose.
alter table public.leads enable row level security;

-- Handy view: where do leads come from?
create or replace view public.lead_sources
  with (security_invoker = true) as
select
  coalesce(utm_source,
           case when referrer is not null then split_part(split_part(referrer, '://', 2), '/', 1) end,
           'direct') as source,
  count(*)                                  as leads,
  count(*) filter (where status = 'won')    as won,
  max(created_at)                           as last_lead_at
from public.leads
group by 1
order by leads desc;
