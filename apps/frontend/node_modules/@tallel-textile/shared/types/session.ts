export interface User {
  id: string;
  email: string;
  role: string | null;
}

export interface Session {
  user: User;
  expires: string;
}
