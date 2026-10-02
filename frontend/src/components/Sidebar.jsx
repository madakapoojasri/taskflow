import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const links = ["Dashboard", "My Tasks", "Categories", "Settings"];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">✓ TaskFlow</div>

      <nav className="sidebar-nav">
        {links.map((link, index) => (
          <button
            key={link}
            className={index === 0 ? "nav-item active" : "nav-item"}
          >
            {link}
          </button>
        ))}
      </nav>

      <ThemeToggle />
      <button className="nav-item logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;