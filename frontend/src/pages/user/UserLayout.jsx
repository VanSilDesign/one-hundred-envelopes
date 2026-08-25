import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";

function UserLayout() {
  const { user, isLoading } = useAuth();
  console.log("UserLayout component", user);

  if (isLoading) {
    return <div>Verifica sessione in corso...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace/>
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default UserLayout;

