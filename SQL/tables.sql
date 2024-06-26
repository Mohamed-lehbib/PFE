CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_logo VARCHAR(255),
    user_id UUID NOT NULL,
    team_id UUID[],
    password VARCHAR(255),
    progress VARCHAR(255)
);

-- adding the created_at column
ALTER TABLE public.project
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER project_updated_at_trigger
BEFORE UPDATE ON project
FOR EACH ROW EXECUTE FUNCTION update_project_updated_at();

-- Alter the table to add the updated_at column
ALTER TABLE project
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Add the supabase_url column
ALTER TABLE project
ADD COLUMN supabase_url VARCHAR(255);

-- Add the supabase_service_role_key column
ALTER TABLE project
ADD COLUMN supabase_service_role_key VARCHAR(255);

-- Create the table with the new columns
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project_id INTEGER NOT NULL,
    attributes JSONB,
    status table_status NOT NULL,
    actions TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_table_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER table_updated_at_trigger
BEFORE UPDATE ON tables
FOR EACH ROW EXECUTE FUNCTION update_table_updated_at();