-- Fix RLS policies for operations table to enable reference creation
-- Drop existing policies first to avoid conflicts

-- Drop existing policies for operations table
DROP POLICY IF EXISTS "Allow service role full access to operations" ON operations;
DROP POLICY IF EXISTS "Allow anon full access to operations" ON operations;

-- Create comprehensive RLS policies for operations table
CREATE POLICY "Allow service role full access to operations"
ON operations FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon full access to operations"
ON operations FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Also ensure authenticated users can access operations
CREATE POLICY "Allow authenticated full access to operations"
ON operations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled but policies allow access
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;

-- Verify the policies are working by granting necessary permissions
GRANT ALL ON operations TO service_role;
GRANT ALL ON operations TO anon;
GRANT ALL ON operations TO authenticated;