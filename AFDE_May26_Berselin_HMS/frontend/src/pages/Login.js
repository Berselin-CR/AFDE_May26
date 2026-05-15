import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_PASSWORD = "support123";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("employee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!username.trim()) { setError("Please enter your name."); return; }
    if (role === "support_admin" && password !== ADMIN_PASSWORD) {
      setError("Incorrect password.");
      return;
    }
    login(role, username.trim());
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🎧</div>
        <h1 style={styles.title}>Helpdesk</h1>
        <p style={styles.subtitle}>Sign in to continue</p>

        <div style={styles.roleToggle}>
          <button
            style={{ ...styles.roleBtn, ...(role === "employee" ? styles.roleBtnActive : {}) }}
            onClick={() => { setRole("employee"); setPassword(""); setError(""); }}
          >
            Employee
          </button>
          <button
            style={{ ...styles.roleBtn, ...(role === "support_admin" ? styles.roleBtnActive : {}) }}
            onClick={() => { setRole("support_admin"); setError(""); }}
          >
            Support Admin
          </button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Your Name</label>
          <input
            style={styles.input}
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {role === "support_admin" && (
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.loginBtn} onClick={handleLogin}>
          Sign In as {role === "employee" ? "Employee" : "Support Admin"}
        </button>

        <p style={styles.hint}>
          {role === "employee"
            ? "Employees can create and view support tickets."
            : "Support Admins can manage and resolve all tickets."}
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" },
  card: { background: "#fff", borderRadius: "12px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" },
  logo: { fontSize: "40px", marginBottom: "8px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1e3a5f", margin: "0 0 4px" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "24px" },
  roleToggle: { display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "4px", marginBottom: "20px" },
  roleBtn: { flex: 1, padding: "8px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", background: "transparent", color: "#64748b", transition: "all 0.15s" },
  roleBtnActive: { background: "#1e3a5f", color: "#fff", fontWeight: "600" },
  field: { textAlign: "left", marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  error: { color: "#dc2626", fontSize: "13px", margin: "0 0 12px", textAlign: "left" },
  loginBtn: { width: "100%", padding: "12px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "16px" },
  hint: { fontSize: "12px", color: "#94a3b8", margin: 0 },
};

export default Login;
