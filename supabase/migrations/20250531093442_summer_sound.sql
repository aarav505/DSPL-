-- Enable RLS on Users table
alter table "Users" enable row level security;

-- Policy for users to read their own profile
create policy "Users can read own profile"
on "Users"
for select
using (auth.uid() = id);

-- Policy for creating user profile during signup
create policy "Enable insert for authentication users only"
on "Users"
for insert
with check (auth.uid() = id);

-- Policy for users to update their own profile
create policy "Users can update own profile"
on "Users"
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Policy for users to read team data
create policy "Enable read access for all authenticated users"
on "user_teams"
for select
using (auth.role() = 'authenticated');

-- Policy for users to manage their own team
create policy "Enable insert/update/delete for users based on user_id"
on "user_teams"
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);