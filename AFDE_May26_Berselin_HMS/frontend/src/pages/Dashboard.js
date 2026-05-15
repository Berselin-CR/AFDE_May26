import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";
import TicketCard from "../components/TicketCard";

const priorityColor  = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626", Critical: "#7c3aed" };
const statusColor    = { Open: "#2563eb", "In Progress": "#d97706", Resolved: "#16a34a", Rejected: "#6b7280" };
const categoryColor  = {
  "VPN Issue":              "#7c3aed",
  "Password Reset":         "#db2777",
  "Software Installation":  "#0891b2",
  "Laptop Issue":           "#d97706",
  "Email Access":           "#2563eb",
  "Network Connectivity":   "#16a34a",
  "Hardware Request":       "#dc2626",
  "Other":                  "#6b7280",
};

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ ...s.statCard, borderLeft: `4px solid ${color}` }}>
    <div style={s.statIcon}>{icon}</div>
    <div style={{ ...s.statValue, color }}>{value}</div>
    <div style={s.statLabel}>{label}</div>
  </div>
);

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth?.role === "support_admin";

  useEffect(() => {
    getAllTickets().then((r) => { setTickets(r.data); setLoading(false); });
  }, []);

  const counts = {
    total:      tickets.length,
    open:       tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved:   tickets.filter((t) => t.status === "Resolved").length,
    closed:     tickets.filter((t) => t.status === "Rejected").length,
  };

  const byPriority = ["Low", "Medium", "High", "Critical"].map((p) => ({
    label: p, count: tickets.filter((t) => t.priority === p).length, color: priorityColor[p],
  }));

  const byStatus = ["Open", "In Progress", "Resolved", "Rejected"].map((st) => ({
    label: st, count: tickets.filter((t) => t.status === st).length, color: statusColor[st],
  }));

  const byCategory = Object.keys(categoryColor).map((cat) => ({
    label: cat, count: tickets.filter((t) => t.issue_category === cat).length, color: categoryColor[cat],
  })).filter(({ count }) => count > 0);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Dashboard</h1>
          <p style={s.sub}>Welcome back, <strong>{auth?.username}</strong> · {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        {!isAdmin && (
          <button style={s.newBtn} onClick={() => navigate("/create")}>+ New Ticket</button>
        )}
      </div>

      {/* Stat row */}
      <div style={s.statRow}>
        <StatCard label="Total Tickets"  value={counts.total}      color="#1e40af" icon="🎫" />
        <StatCard label="Open"           value={counts.open}       color="#2563eb" icon="📬" />
        <StatCard label="In Progress"    value={counts.inProgress} color="#d97706" icon="⚙️" />
        <StatCard label="Resolved"       value={counts.resolved}   color="#16a34a" icon="✅" />
      </div>

      {/* Two-column body */}
      <div style={s.body}>

        {/* Left — Recent tickets */}
        <div style={s.left}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>Recent Tickets</span>
            <button style={s.viewAll} onClick={() => navigate("/tickets")}>View all →</button>
          </div>
          {loading ? (
            <div style={s.empty}>Loading…</div>
          ) : tickets.length === 0 ? (
            <div style={s.empty}>No tickets yet.</div>
          ) : (
            <div style={s.ticketList}>
              {tickets.slice(0, 8).map((t) => <TicketCard key={t.ticket_id} ticket={t} />)}
            </div>
          )}
        </div>

        {/* Right — Summary panels */}
        <div style={s.right}>

          {/* Status breakdown */}
          <div style={s.panel}>
            <div style={s.panelTitle}>By Status</div>
            {byStatus.map(({ label, count, color }) => (
              <div key={label} style={s.barRow}>
                <span style={s.barLabel}>{label}</span>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width: counts.total ? `${(count / counts.total) * 100}%` : "0%", background: color }} />
                </div>
                <span style={{ ...s.barCount, color }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Priority breakdown */}
          <div style={s.panel}>
            <div style={s.panelTitle}>By Priority</div>
            {byPriority.map(({ label, count, color }) => (
              <div key={label} style={s.barRow}>
                <span style={s.barLabel}>{label}</span>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width: counts.total ? `${(count / counts.total) * 100}%` : "0%", background: color }} />
                </div>
                <span style={{ ...s.barCount, color }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={s.panel}>
            <div style={s.panelTitle}>By Category</div>
            {byCategory.length === 0 ? (
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>No tickets yet.</div>
            ) : (
              byCategory.map(({ label, count, color }) => (
                <div key={label} style={s.barRow}>
                  <span style={{ ...s.barLabel, width: "120px" }}>{label}</span>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width: counts.total ? `${(count / counts.total) * 100}%` : "0%", background: color }} />
                  </div>
                  <span style={{ ...s.barCount, color }}>{count}</span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const s = {
  page:       { padding: "28px 32px", maxWidth: "1280px", margin: "0 auto" },
  header:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
  title:      { fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" },
  sub:        { fontSize: "13px", color: "#64748b", margin: 0 },
  newBtn:     { padding: "10px 20px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13.5px", fontWeight: "600" },
  statRow:    { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard:   { background: "#fff", borderRadius: "10px", padding: "20px 20px 16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px" },
  statIcon:   { fontSize: "20px" },
  statValue:  { fontSize: "30px", fontWeight: "700", lineHeight: 1 },
  statLabel:  { fontSize: "12px", color: "#64748b", fontWeight: "500" },
  body:       { display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" },
  left:       { background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", padding: "20px" },
  right:      { display: "flex", flexDirection: "column", gap: "16px" },
  sectionHead:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle:{ fontSize: "14px", fontWeight: "700", color: "#0f172a" },
  viewAll:    { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px" },
  ticketList: { display: "flex", flexDirection: "column", gap: "10px" },
  empty:      { padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px" },
  panel:      { background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", padding: "18px 20px" },
  panelTitle: { fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "14px" },
  barRow:     { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  barLabel:   { fontSize: "12px", color: "#475569", width: "80px", flexShrink: 0 },
  barTrack:   { flex: 1, height: "7px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" },
  barFill:    { height: "100%", borderRadius: "4px", transition: "width 0.4s" },
  barCount:   { fontSize: "12px", fontWeight: "700", width: "20px", textAlign: "right" },
};

export default Dashboard;
