import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../app/store";
import { useGetProfileQuery } from "../features/api/authApi";

interface ProtectedRouteProps {
  requiredPermission?: string[];
}

export default function ProtectedRoute({
  requiredPermission,
}: ProtectedRouteProps) {
  const token = useSelector((state: RootState) => state.auth.token);

  const { data: profile } = useGetProfileQuery(undefined, { skip: !token });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && requiredPermission.length > 0) {
    const permissions = profile?.permissions ?? [];
    const hasPermission = permissions.some((permission) =>
      requiredPermission.includes(permission),
    );
    if (!hasPermission) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
}
