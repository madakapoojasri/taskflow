import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ThemeToggle from "./ThemeToggle";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = ["Dashboard"];

  // Close the drawer with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Top bar: only visible on mobile */}
      <header className="mobile-bar">
        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="sidebar-logo">✓ TaskFlow</span>
      </header>

      {/* Dark overlay behind the open drawer (mobile only) */}
      {open && (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} />
      )}

      <aside className={open ? "sidebar open" : "sidebar"}>
        <button
          type="button"
          className="sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="sidebar-logo">✓ TaskFlow</div>

        <nav className="sidebar-nav">
          {links.map((link, index) => (
            <button
              key={link}
              className={index === 0 ? "nav-item active" : "nav-item"}
              onClick={() => setOpen(false)}
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
    </>
  );
}

export default Sidebar;