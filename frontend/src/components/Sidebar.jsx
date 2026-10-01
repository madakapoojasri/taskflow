import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

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

      <button className="nav-item logout" onClick={() => navigate("/login")}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;