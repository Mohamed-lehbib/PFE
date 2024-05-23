CREATE TABLE project (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_logo VARCHAR(255),
    user_id UUID NOT NULL,
    team_id UUID[] NOT NULL,
    password VARCHAR(255) NOT NULL,
    progress VARCHAR(255) NOT NULL
);
