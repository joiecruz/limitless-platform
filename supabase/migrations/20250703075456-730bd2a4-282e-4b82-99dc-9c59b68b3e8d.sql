-- Add foreign key constraints for cascade deletion when projects are deleted

-- Add foreign key to project_members table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_members_project_id_fkey'
        AND table_name = 'project_members'
    ) THEN
        ALTER TABLE project_members 
        ADD CONSTRAINT project_members_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key to ideas table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'ideas_project_id_fkey'
        AND table_name = 'ideas'
    ) THEN
        ALTER TABLE ideas 
        ADD CONSTRAINT ideas_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key to project_stages table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_stages_project_id_fkey'
        AND table_name = 'project_stages'
    ) THEN
        ALTER TABLE project_stages 
        ADD CONSTRAINT project_stages_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key to project_steps table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_steps_project_id_fkey'
        AND table_name = 'project_steps'
    ) THEN
        ALTER TABLE project_steps 
        ADD CONSTRAINT project_steps_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key to project_step_content table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_step_content_project_id_fkey'
        AND table_name = 'project_step_content'
    ) THEN
        ALTER TABLE project_step_content 
        ADD CONSTRAINT project_step_content_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
    END IF;
END $$;