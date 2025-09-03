SET search_path = public, auth;

-- Create a table for polls
create table if not exists polls (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  question text not null,
  description text,
  options text[] not null,
  allow_multiple_options boolean default false not null,
  require_login boolean default false not null,
  end_date timestamp with time zone
);

-- Set up Row Level Security (RLS) for polls
alter table polls enable row level security;

-- Allow authenticated users to create polls
create policy "Authenticated users can create polls."
  on polls for insert
  with check (auth.uid() = user_id);

-- Allow everyone to view polls
create policy "Polls are viewable by everyone."
  on polls for select
  using (true);

-- Allow poll creators to update their own polls
create policy "Poll creators can update their own polls."
  on polls for update
  using (auth.uid() = user_id);

-- Allow poll creators to delete their own polls
create policy "Poll creators can delete their own polls."
  on polls for delete
  using (auth.uid() = user_id);

-- Create a table for votes
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  poll_id uuid references polls(id) on delete cascade not null,
  option_chosen text not null,

  -- Ensure a user can only vote once per poll
  unique (user_id, poll_id)
);

-- Set up Row Level Security (RLS) for votes
alter table votes enable row level security;

-- Allow authenticated users to create votes
create policy "Authenticated users can create votes."
  on votes for insert
  with check (auth.uid() = user_id);

-- Allow everyone to view votes
create policy "Votes are viewable by everyone."
  on votes for select
  using (true);

-- Allow users to update their own votes (e.g., change their mind)
create policy "Users can update their own votes."
  on votes for update
  using (auth.uid() = user_id);

-- Allow users to delete their own votes
create policy "Users can delete their own votes."
  on votes for delete
  using (auth.uid() = user_id);