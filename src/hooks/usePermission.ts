import { useGetProfileQuery } from "../features/api/authApi";

export function usePermission() {
  const { data: profile } = useGetProfileQuery();
  const permissions = profile?.permissions ?? [];

  const hasPermission = (permission: string) => permissions.includes(permission);

  const hasAnyPermission = (perms: string[]) =>
    perms.some((p) => permissions.includes(p));

  return { permissions, hasPermission, hasAnyPermission };
}
