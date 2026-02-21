export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles: string[];
  permissions: string[];
}

export interface ProfileData {
  user: User;
  permissions: string[];
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
}

export interface CreateUserRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  roleIds: number[];
}

export interface UpdateUserRequest {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  roleIds?: number[];
}
