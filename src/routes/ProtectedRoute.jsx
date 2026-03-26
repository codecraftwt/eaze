import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Requires a logged-in portal session. The API may set `portalUserId` without
 * a separate `token` field; the app uses portalUserId everywhere for APIs.
 */
export default function ProtectedRoute() {
  const { token, portalUserId } = useSelector((state) => state.auth);
  const location = useLocation();

  const isAuthenticated = Boolean(token || portalUserId);

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}
