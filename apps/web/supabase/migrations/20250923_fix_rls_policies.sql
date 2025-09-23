-- Fix RLS policies to allow anonymous access to demo data
-- This enables the frontend to consume real data from Supabase

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON service_references;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON operations;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lab_analysis;

-- Create permissive policies for demo data access
CREATE POLICY "Allow public read access to service_references"
ON service_references FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to operations"
ON operations FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to lab_analysis"
ON lab_analysis FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert/update service_references
CREATE POLICY "Allow authenticated insert on service_references"
ON service_references FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on service_references"
ON service_references FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to insert/update operations
CREATE POLICY "Allow authenticated insert on operations"
ON operations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on operations"
ON operations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to insert/update lab_analysis
CREATE POLICY "Allow authenticated insert on lab_analysis"
ON lab_analysis FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on lab_analysis"
ON lab_analysis FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public access to RPC functions
GRANT EXECUTE ON FUNCTION generate_reference_number() TO public;