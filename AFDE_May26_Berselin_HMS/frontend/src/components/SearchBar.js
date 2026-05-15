import React, { useState } from "react";

const CATEGORIES = ["", "VPN Issue", "Password Reset", "Software Installation", "Laptop Issue", "Email Access", "Network Connectivity", "Hardware Request", "Other"];
const STATUSES = ["", "Open", "In Progress", "Resolved", "Closed"];

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => onSearch({ keyword, category, status });
  const handleReset = () => {
    setKeyword(""); setCategory(""); setStatus("");
    onSearch({ keyword: "", category: "", status: "" });
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        placeholder="Search by keyword, name, department…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
      </select>
      <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
      </select>
      <button style={styles.btnPrimary} onClick={handleSearch}>Search</button>
      <button style={styles.btnSecondary} onClick={handleReset}>Reset</button>
    </div>
  );
};

const styles = {
  container: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  input: { flex: 2, minWidth: "200px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" },
  select: { flex: 1, minWidth: "140px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" },
  btnPrimary: { padding: "8px 20px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  btnSecondary: { padding: "8px 16px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
};

export default SearchBar;
