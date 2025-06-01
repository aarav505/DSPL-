/*
  # Add Users table RLS policies

  1. Security Changes
    - Add RLS policy to allow users to create their own profile during signup
    - Add RLS policy to allow users to read their own profile
    - Add RLS policy to allow users to update their own profile
    - Add RLS policy to allow users to delete their own profile

  2. Notes
    - These policies ensure users can only manage their own profile data
    - The insert policy specifically allows new users to create their profile during signup
    - All policies use auth.uid() = id to match the authenticated user with the profile
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can create their own profile" ON "Users";
DROP POLICY IF EXISTS "Users can read own profile" ON "Users";
DROP POLICY IF EXISTS "Users can update own profile" ON "Users";
DROP POLICY IF EXISTS "Users can delete own profile" ON "Users";

-- Create new policies
CREATE POLICY "Users can create their own profile"
ON "Users"
FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
ON "Users"
FOR SELECT
TO public
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON "Users"
FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON "Users"
FOR DELETE
TO public
USING (auth.uid() = id);