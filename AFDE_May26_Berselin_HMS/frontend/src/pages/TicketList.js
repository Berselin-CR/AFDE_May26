import React, { useEffect, useState } from "react";
import { getAllTickets, searchTickets } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

const priorityColors = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626", Critical: "#7c3aed" };
const statusColors   = { Open: "#2563eb", "In Progress": "#d97706", Resolved: "#16a34a", Rejected: "#6b7280" };

const Badge = ({ text, colorMap }) => {
  const c = colorMap[text] || "#64748b";
  return <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "10px", background: c + "15", color: c, border: `1px solid ${c}30` }}>{text}</span>;
};

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth?.role === "support_admin";

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    setLoading(true);
    getAllTickets().then((r) => { setTickets(r.data); setLoading(false); });
  };

  const handleSearch = ({ keyword, category, status }) => {
    if (!keyword && !category && !status) { fetchAll(); return; }
    setLoading(true);
    searchTickets({ keyword, category, status }).then((r) => { setTickets(r.data); setLoading(false); });
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>All Tickets</h1>
          <p style={s.sub}>{tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} found</p>
        </div>
        {!isAdmin && (
          <button style={s.newBtn} onClick={() => navigate("/create")}>+ New Ticket</button>
        )}
      </div>

      <div style={s.searchWrap}>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div style={s.tableWrap}>
        {loading ? (
          <div style={s.empty}>Loading…</div>
        ) : tickets.length === 0 ? (
          <div style={s.empty}>No tickets found.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={{ ...s.th, width: "60px" }}>#</th>
                <th style={s.th}>Category</th>
                <th style={s.th}>Description</th>
                <th style={s.th}>Employee</th>
                <th style={s.th}>Priority</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.ticket_id} style={s.tr} onClick={() => navigate(`/tickets/${t.ticket_id}`)}>
                  <td style={{ ...s.td, color: "#94a3b8", fontWeight: "600" }}>#{t.ticket_id}</td>
                  <td style={{ ...s.td, fontWeight: "600", color: "#0f172a" }}>{t.issue_category}</td>
                  <td style={{ ...s.td, color: "#475569", maxWidth: "260px" }}>
                    <span style={{ display: "block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {t.description}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.empCell}>
                      <div style={s.empAvatar}>{t.employee_name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: "500", color: "#0f172a" }}>{t.employee_name}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{t.department}</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}><Badge text={t.priority} colorMap={priorityColors} /></td>
                  <td style={s.td}><Badge text={t.status} colorMap={statusColors} /></td>
                  <td style={{ ...s.td, color: "#94a3b8", fontSize: "12px" }}>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const s = {
  page:      { padding: "28px 32px", maxWidth: "1280px", margin: "0 auto" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  title:     { fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" },
  sub:       { fontSize: "13px", color: "#64748b", margin: 0 },
  newBtn:    { padding: "10px 20px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13.5px", fontWeight: "600" },
  searchWrap:{ marginBottom: "16px" },
  tableWrap: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" },
  table:     { width: "100%", borderCollapse: "collapse" },
  thead:     { background: "#f8fafc" },
  th:        { padding: "11px 16px", textAlign: "left", fontSize: "11.5px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #e2e8f0" },
  tr:        { borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.1s" },
  td:        { padding: "13px 16px", fontSize: "13px", verticalAlign: "middle" },
  empty:     { padding: "60px", textAlign: "center", color: "#94a3b8", fontSize: "14px" },
  empCell:   { display: "flex", alignItems: "center", gap: "8px" },
  empAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
};

export default TicketList;
