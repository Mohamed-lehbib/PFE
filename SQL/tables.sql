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