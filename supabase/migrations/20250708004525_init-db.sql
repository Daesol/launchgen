-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  subscription_tier text default 'free'
);

-- Landing Pages table
create table if not exists landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text,
  owner_id uuid references users(id),
  config_json jsonb,
  analytics_config jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Leads table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references landing_pages(id),
  name text,
  email text,
  source text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Analytics Events table
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references landing_pages(id),
  event_type text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);