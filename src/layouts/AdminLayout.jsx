
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();
  const token = sessionStorage.getItem("vandaluxe_admin_token");

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <main>
      <Outlet />
    </main>
  );
}

export default AdminLayout;
