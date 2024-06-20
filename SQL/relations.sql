ALTER TABLE project
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Add the foreign key constraint separately
ALTER TABLE tables
ADD CONSTRAINT fk_project
FOREIGN KEY (project_id) 
REFERENCES project(id) 
ON DELETE CASCADE;