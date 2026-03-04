export interface IRole {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: IRole[];
}

export interface IProject {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  creator: IUser;
}

export interface ITask {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  project_id: number;
  assigned_to: number;
  project?: IProject;
  assignee?: IUser;
}

export interface IDashboardStats {
  total_projects: number;
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
}
