export interface User {
  _id: string;
  id: string;
  name?: string
  username?: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
  photo?: string;
  role?: "admin" | "student" | "teacher";
}