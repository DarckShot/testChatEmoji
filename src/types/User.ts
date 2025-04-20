export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface UserSession {
  user: User;
  lastActive: number;
}
