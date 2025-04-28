import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

// This component ensures only authenticated users with allowed roles can access certain routes
export default function RouteProtection({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const { role, loading } = useUserRole();

  // Show nothing while checking the session and role
  if (loading) return null;

  // Redirect to login if not logged in or if role is not allowed
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/employee-login" replace />;
  }

  // Otherwise, allow access
  return children;
}