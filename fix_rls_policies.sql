-- SQL script to fix RLS policies for Incolab
-- Execute this in Supabase SQL Editor with your service role credentials

-- First, drop existing restrictive policies
DROP POLICY IF EXISTS "Allow service role full access to operations" ON operations;
DROP POLICY IF EXISTS "Allow anon full access to operations" ON operations;
DROP POLICY IF EXISTS "Allow authenticated full access to operations" ON operations;

DROP POLICY IF EXISTS "Allow service role full access to lab_analysis" ON lab_analysis;
DROP POLICY IF EXISTS "Allow anon full access to lab_analysis" ON lab_analysis;
DROP POLICY IF EXISTS "Allow authenticated full access to lab_analysis" ON lab_analysis;

-- Create new permissive policies for operations table
CREATE POLICY "operations_all_access" ON operations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create new permissive policies for lab_analysis table
CREATE POLICY "lab_analysis_all_access" ON lab_analysis
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled but allow all access
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_references ENABLE ROW LEVEL SECURITY;

-- Grant explicit permissions to all roles
GRANT ALL ON operations TO service_role, anon, authenticated;
GRANT ALL ON lab_analysis TO service_role, anon, authenticated;
GRANT ALL ON service_references TO service_role, anon, authenticated;

-- Create a function to manually create missing operations and lab_analysis for existing references
CREATE OR REPLACE FUNCTION create_missing_tasks()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    ref RECORD;
BEGIN
    -- Loop through references that don't have operations
    FOR ref IN
        SELECT sr.id, sr.reference_number, sr.priority
        FROM service_references sr
        LEFT JOIN operations op ON sr.id = op.reference_id
        WHERE op.id IS NULL
    LOOP
        -- Create missing operation
        INSERT INTO operations (reference_id, operation_type, status, priority, notes, created_at)
        VALUES (
            ref.id,
            'sampling',
            'pending',
            COALESCE(ref.priority, 'normal'),
            'Operación de muestreo para ' || ref.reference_number,
            NOW()
        );

        RAISE NOTICE 'Created operation for reference %', ref.reference_number;
    END LOOP;

    -- Loop through references that don't have lab_analysis
    FOR ref IN
        SELECT sr.id, sr.reference_number, sr.priority
        FROM service_references sr
        LEFT JOIN lab_analysis la ON sr.id = la.reference_id
        WHERE la.id IS NULL
    LOOP
        -- Create missing lab analysis
        INSERT INTO lab_analysis (reference_id, analysis_type, status, priority, notes, created_at)
        VALUES (
            ref.id,
            ARRAY['general'],
            'waiting_sample',
            COALESCE(ref.priority, 'normal'),
            'Análisis de laboratorio para ' || ref.reference_number,
            NOW()
        );

        RAISE NOTICE 'Created lab analysis for reference %', ref.reference_number;
    END LOOP;
END;
$$;

-- Execute the function to create missing tasks
SELECT create_missing_tasks();

-- Verify the policies are working
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('operations', 'lab_analysis', 'service_references')
ORDER BY tablename, policyname;