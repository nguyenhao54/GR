export interface User {
  _id: string;
  codeNumber: string;
  id: string;
  faculty?: string;
  name?: string;
  DOB?: Date;
  major?: string;
  phone: string;
  username?: string;
  email: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  photo?: string;
  active?: boolean;
  role?: "admin" | "student" | "teacher";
}