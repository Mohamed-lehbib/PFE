ALTER TABLE project
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES auth.users(id);
