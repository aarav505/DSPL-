-- Enable RLS on Users table (if not already enabled)
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can create their own profile" ON "Users";
    DROP POLICY IF EXISTS "Users can read their own profile" ON "Users";
    DROP POLICY IF EXISTS "Users can update their own profile" ON "Users";
    DROP POLICY IF EXISTS "Users can delete their own profile" ON "Users";
END $$;

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