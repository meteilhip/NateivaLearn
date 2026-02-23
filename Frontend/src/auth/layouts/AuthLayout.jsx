import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 * Fond blanc
 * - Centre le contenu
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <Outlet />
    </div>
  );
}