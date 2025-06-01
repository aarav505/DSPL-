/*
  # Fix Users table RLS policies

  1. Security Changes
    - Enable RLS on Users table
    - Add policy for unauthenticated users to insert their own profile during signup
    - Add policy for authenticated users to read their own profile
    - Add policy for authenticated users to update their own profile
    - Add policy for authenticated users to delete their own profile

  Note: The policies ensure users can only access and modify their own data, maintaining security while allowing necessary operations.
*/

-- Enable RLS
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;

-- Allow unauthenticated users to insert their own profile during signup
CREATE POLICY "Users can create their own profile during signup"
ON "Users"
FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read their own profile"
ON "Users"
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile"
ON "Users"
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON "Users"
FOR DELETE
TO authenticated
USING (auth.uid() = id);