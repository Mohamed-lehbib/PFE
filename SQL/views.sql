CREATE OR REPLACE VIEW project_user_view AS
select
  p.id as project_id,
  p.name as project_name,
  p.description as project_description,
  p.project_logo as project_logo,
  p.user_id as project_user_id,
  p.team_id as project_team_id,
  p.password as project_password,
  p.progress as project_progress,
  p.created_at as project_created_at,
  u.email as user_email,
  u.raw_user_meta_data as user_metadata
from
  public.project p
  left join auth.users u on p.user_id = u.id;