import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const isAdmin = auth?.role === "support_admin";

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/tickets", label: "All Tickets" },
    ...(!isAdmin ? [{ path: "/create", label: "+ New Ticket" }] : []),
  ];

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🎧</span>
          <span style={styles.brandText}>Helpdesk</span>
        </div>
        <div style={styles.links}>
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}
                style={{ ...styles.link, ...(active ? styles.activeLink : {}) }}>
                {link.label}
                {active && <span style={styles.activeDot} />}
              </Link>
            );
          })}
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{auth?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div style={styles.username}>{auth?.username}</div>
            <div style={{ ...styles.rolePill, background: isAdmin ? "#7c3aed" : "#0284c7" }}>
              {isAdmin ? "Support Admin" : "Employee"}
            </div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: "60px", background: "#0f172a", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100 },
  left: { display: "flex", alignItems: "center", gap: "36px" },
  brand: { display: "flex", alignItems: "center", gap: "8px" },
  brandIcon: { fontSize: "20px" },
  brandText: { fontWeight: "700", fontSize: "16px", color: "#f1f5f9", letterSpacing: "0.3px" },
  links: { display: "flex", gap: "4px" },
  link: { color: "#94a3b8", textDecoration: "none", fontSize: "13.5px", fontWeight: "500", padding: "6px 12px", borderRadius: "6px", position: "relative", transition: "all 0.15s" },
  activeLink: { color: "#f1f5f9", background: "#1e293b" },
  activeDot: { display: "block", position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "#60a5fa" },
  right: { display: "flex", alignItems: "center", gap: "16px" },
  userInfo: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "34px", height: "34px", borderRadius: "50%", background: "#1e40af", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700" },
  username: { fontSize: "13px", color: "#e2e8f0", fontWeight: "500", lineHeight: 1.3 },
  rolePill: { fontSize: "10px", fontWeight: "600", padding: "1px 6px", borderRadius: "8px", color: "#fff", display: "inline-block" },
  logoutBtn: { fontSize: "12px", padding: "6px 14px", background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: "6px", cursor: "pointer" },
};

export default Navbar;
