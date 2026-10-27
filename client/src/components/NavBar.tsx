import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        EscapeZone
      </Link>
      <div className="navbar-links">
        <NavLink to="/rooms">חדרים</NavLink>
        {user?.role === "admin" && <NavLink to="/admin">ניהול</NavLink>}
      </div>
      <div className="navbar-user">
        {user ? (
          <>
            <span>שלום, {user.name}</span>
            <button type="button" onClick={handleLogout}>
              התנתקות
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">התחברות</NavLink>
            <NavLink to="/register">הרשמה</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
