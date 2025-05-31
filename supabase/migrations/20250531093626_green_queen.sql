/*
  # Add RLS policies for Users table

  1. Security Changes
    - Enable RLS on Users table
    - Add policies for:
      - Users can create their own profile during signup
      - Users can read their own profile
      - Users can update their own profile
      - Users can delete their own profile

  2. Notes
    - Ensures users can only access and modify their own data
    - Maintains data isolation between different users
    - Allows new user registration to work properly
*/

-- Enable RLS on Users table (if not already enabled)
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;

-- Policy for creating own profile
CREATE POLICY "Users can create their own profile"
ON "Users"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for reading own profile
CREATE POLICY "Users can read their own profile"
ON "Users"
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for updating own profile
CREATE POLICY "Users can update their own profile"
ON "Users"
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for deleting own profile
CREATE POLICY "Users can delete their own profile"
ON "Users"
FOR DELETE
TO authenticated
USING (auth.uid() = id);