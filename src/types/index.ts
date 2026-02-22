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
}

export interface UpdateUserRequest {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AddUserRolesRequest {
  userId: number;
  roleIds: number[];
}

export interface Permission {
  id: number;
  action: string;
  resource: string;
  created_at: string;
  updated_at: string;
}

export interface AddUserPermissionsRequest {
  userId: number;
  permissionIds: number[];
}
