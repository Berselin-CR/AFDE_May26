import React from "react";
import { useNavigate } from "react-router-dom";

const priorityColors = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626", Critical: "#7c3aed" };
const statusColors   = { Open: "#2563eb", "In Progress": "#d97706", Resolved: "#16a34a", Rejected: "#6b7280" };

const categoryIcon = {
  "VPN Issue": "🔐", "Password Reset": "🔑", "Software Installation": "💿",
  "Laptop Issue": "💻", "Email Access": "📧", "Network Connectivity": "🌐",
  "Hardware Request": "🖥️", "Other": "📋",
};

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const pc = priorityColors[ticket.priority] || "#64748b";
  const sc = statusColors[ticket.status]    || "#64748b";

  return (
    <div style={s.card} onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}>
      <div style={s.left}>
        <div style={s.icon}>{categoryIcon[ticket.issue_category] || "📋"}</div>
      </div>
      <div style={s.body}>
        <div style={s.top}>
          <span style={s.category}>{ticket.issue_category}</span>
          <span style={s.id}>#{ticket.ticket_id}</span>
        </div>
        <p style={s.desc}>{ticket.description.length > 80 ? ticket.description.slice(0, 80) + "…" : ticket.description}</p>
        <div style={s.footer}>
          <span style={s.meta}>{ticket.employee_name} · {ticket.department}</span>
          <div style={s.badges}>
            <span style={{ ...s.badge, background: pc + "15", color: pc, border: `1px solid ${pc}30` }}>{ticket.priority}</span>
            <span style={{ ...s.badge, background: sc + "15", color: sc, border: `1px solid ${sc}30` }}>{ticket.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  card:     { display: "flex", gap: "12px", padding: "14px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" },
  left:     { flexShrink: 0 },
  icon:     { width: "38px", height: "38px", background: "#f1f5f9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" },
  body:     { flex: 1, minWidth: 0 },
  top:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  category: { fontSize: "13px", fontWeight: "600", color: "#0f172a" },
  id:       { fontSize: "11px", color: "#94a3b8", fontWeight: "500" },
  desc:     { fontSize: "12.5px", color: "#475569", margin: "0 0 8px", lineHeight: "1.5" },
  footer:   { display: "flex", justifyContent: "space-between", alignItems: "center" },
  meta:     { fontSize: "11.5px", color: "#94a3b8" },
  badges:   { display: "flex", gap: "6px" },
  badge:    { fontSize: "10.5px", fontWeight: "600", padding: "2px 7px", borderRadius: "10px" },
};

export default TicketCard;
