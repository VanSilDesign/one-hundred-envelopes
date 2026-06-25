import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function UserLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Caricamento layout...</div>;
  }

  if (!user) {
    throw new Response(
      JSON.stringify({ message: "Effettua il login per vedere questa pagina." }), 
      { status: 401 }
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default UserLayout;

