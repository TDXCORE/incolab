-- Fix RLS policies to allow service role access for demo functionality
-- This enables the frontend to create and manage data using the admin client

-- Allow service role full access to service_references
CREATE POLICY "Allow service role full access to service_references"
ON service_references FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow service role full access to operations
CREATE POLICY "Allow service role full access to operations"
ON operations FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow service role full access to lab_analysis
CREATE POLICY "Allow service role full access to lab_analysis"
ON lab_analysis FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also allow anon role for demo purposes (since we're using admin client)
CREATE POLICY "Allow anon full access to service_references"
ON service_references FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon full access to operations"
ON operations FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anon full access to lab_analysis"
ON lab_analysis FOR ALL
TO anon
USING (true)
WITH CHECK (true);