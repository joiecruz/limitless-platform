-- Generate CREATE POLICY statements for all existing workspace_members policies
WITH policy_info AS (
    SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
    FROM 
        pg_policies
    WHERE 
        tablename = 'workspace_members'
)
SELECT 
    'CREATE POLICY ' || quote_literal(policyname) || 
    ' ON ' || quote_ident(schemaname) || '.' || quote_ident(tablename) ||
    ' FOR ' || CASE 
                WHEN cmd = 'SELECT' THEN 'SELECT'
                WHEN cmd = 'INSERT' THEN 'INSERT'
                WHEN cmd = 'UPDATE' THEN 'UPDATE'
                WHEN cmd = 'DELETE' THEN 'DELETE'
                ELSE 'ALL'
              END ||
    ' TO ' || array_to_string(roles, ', ') ||
    CASE 
        WHEN permissive = 'PERMISSIVE' THEN ' AS PERMISSIVE'
        ELSE ' AS RESTRICTIVE'
    END ||
    CASE 
        WHEN qual IS NOT NULL THEN ' USING (' || qual || ')'
        ELSE ''
    END ||
    CASE 
        WHEN with_check IS NOT NULL THEN ' WITH CHECK (' || with_check || ')'
        ELSE ''
    END || ';' AS policy_statement
FROM 
    policy_info
ORDER BY 
    policyname; 