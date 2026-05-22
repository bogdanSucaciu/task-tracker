export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type UserSummary = {
  id: number;
  email: string;
  displayName: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignedUser: UserSummary;
  createdAt: string;
  updatedAt: string;
};

export type TaskPayload = {
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId: number;
};
