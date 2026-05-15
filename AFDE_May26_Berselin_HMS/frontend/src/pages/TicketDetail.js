import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, updateTicket, deleteTicket, getTicketActivities } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Open", "In Progress", "Resolved", "Rejected"];
const priorityColor = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626", Critical: "#7c3aed" };
const statusColor   = { Open: "#2563eb", "In Progress": "#d97706", Resolved: "#16a34a", Rejected: "#6b7280" };
const categoryIcon  = { "VPN Issue": "🔐", "Password Reset": "🔑", "Software Installation": "💿", "Laptop Issue": "💻", "Email Access": "📧", "Network Connectivity": "🌐", "Hardware Request": "🖥️", "Other": "📋" };

const Badge = ({ text, colorMap }) => {
  const c = colorMap[text] || "#64748b";
  return <span style={{ fontSize: "12px", fontWeight: "600", padding: "3px 10px", borderRadius: "10px", background: c + "15", color: c, border: `1px solid ${c}30` }}>{text}</span>;
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth?.role === "support_admin";

  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    Promise.all([getTicketById(id), getTicketActivities(id)]).then(([tRes, aRes]) => {
      setTicket(tRes.data);
      setForm(tRes.data);
      setActivities(aRes.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    const res = await updateTicket(id, { status: form.status, resolution_notes: form.resolution_notes, changed_by: auth?.username });
    setTicket(res.data);
    setEditing(false);
    setSaving(false);
    getTicketActivities(id).then((r) => setActivities(r.data));
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this ticket permanently?")) {
      await deleteTicket(id);
      navigate("/tickets");
    }
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>Loading…</div>;
  if (!ticket)  return <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>Ticket not found.</div>;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back to Tickets</button>

      <div style={s.layout}>
        {/* Main card */}
        <div style={s.main}>
          <div style={s.mainHeader}>
            <div style={s.iconWrap}>{categoryIcon[ticket.issue_category] || "📋"}</div>
            <div style={{ flex: 1 }}>
              <div style={s.ticketId}>Ticket #{ticket.ticket_id}</div>
              <h2 style={s.category}>{ticket.issue_category}</h2>
              <div style={s.badgeRow}>
                <Badge text={ticket.priority} colorMap={priorityColor} />
                <Badge text={editing ? form.status : ticket.status} colorMap={statusColor} />
              </div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionLabel}>Description</div>
            <p style={s.sectionText}>{ticket.description}</p>
          </div>

          <div style={s.section}>
            <div style={s.sectionLabel}>Resolution Notes</div>
            {isAdmin && editing ? (
              <textarea
                style={s.textarea}
                value={form.resolution_notes || ""}
                onChange={(e) => setForm({ ...form, resolution_notes: e.target.value })}
                placeholder="Add resolution notes…"
              />
            ) : (
              <p style={{ ...s.sectionText, color: ticket.resolution_notes ? "#374151" : "#94a3b8", fontStyle: ticket.resolution_notes ? "normal" : "italic" }}>
                {ticket.resolution_notes || "No resolution notes yet."}
              </p>
            )}
          </div>

          {isAdmin && editing && (
            <div style={s.section}>
              <div style={s.sectionLabel}>Update Status</div>
              <div style={s.statusGrid}>
                {STATUSES.map((st) => (
                  <button key={st}
                    style={{ ...s.statusBtn, ...(form.status === st ? { background: statusColor[st], color: "#fff", borderColor: statusColor[st] } : {}) }}
                    onClick={() => setForm({ ...form, status: st })}
                  >{st}</button>
                ))}
              </div>
            </div>
          )}

          {/* Activity timeline */}
          {activities.length > 0 && (
            <div style={s.section}>
              <div style={s.sectionLabel}>Status History</div>
              <div style={s.timeline}>
                {activities.map((a, i) => {
                  const sc = statusColor[a.to_status] || "#64748b";
                  return (
                    <div key={a.id} style={s.timelineItem}>
                      <div style={{ ...s.timelineDot, background: sc }} />
                      {i < activities.length - 1 && <div style={s.timelineLine} />}
                      <div style={s.timelineBody}>
                        <span style={s.timelineText}>
                          <strong>{a.changed_by}</strong> changed status
                          {a.from_status && <> from <span style={{ color: statusColor[a.from_status] || "#64748b", fontWeight: 600 }}>{a.from_status}</span></>}
                          {" "}to <span style={{ color: sc, fontWeight: 600 }}>{a.to_status}</span>
                        </span>
                        <span style={s.timelineTime}>{new Date(a.changed_at).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isAdmin && (
            <div style={s.actions}>
              {editing ? (
                <>
                  <button style={s.btnSecondary} onClick={() => setEditing(false)}>Cancel</button>
                  <button style={s.btnPrimary} onClick={handleUpdate} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
                </>
              ) : (
                <>
                  <button style={s.btnDanger} onClick={handleDelete}>Delete Ticket</button>
                  <button style={s.btnPrimary} onClick={() => setEditing(true)}>Manage Ticket</button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sideCard}>
            <div style={s.sideTitle}>Ticket Info</div>
            <InfoRow label="Employee"   value={ticket.employee_name} />
            <InfoRow label="Department" value={ticket.department} />
            <InfoRow label="Category"   value={ticket.issue_category} />
            <InfoRow label="Created"    value={new Date(ticket.created_at).toLocaleString()} />
          </div>
          {!isAdmin && (
            <div style={{ ...s.sideCard, background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <div style={{ fontSize: "12px", color: "#1e40af", fontWeight: "600", marginBottom: "6px" }}>ℹ️ View Only</div>
              <p style={{ fontSize: "12px", color: "#3b82f6", margin: 0 }}>Only Support Admins can update or close tickets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: "2px" }}>{label}</div>
    <div style={{ fontSize: "13px", color: "#0f172a", fontWeight: "500" }}>{value}</div>
  </div>
);

const s = {
  page:       { padding: "28px 32px", maxWidth: "1100px", margin: "0 auto" },
  back:       { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13.5px", marginBottom: "20px", padding: 0, display: "flex", alignItems: "center", gap: "4px" },
  layout:     { display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" },
  main:       { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "28px" },
  mainHeader: { display: "flex", gap: "16px", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #f1f5f9" },
  iconWrap:   { width: "52px", height: "52px", background: "#f1f5f9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 },
  ticketId:   { fontSize: "12px", color: "#94a3b8", marginBottom: "4px" },
  category:   { fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 10px" },
  badgeRow:   { display: "flex", gap: "8px" },
  section:    { marginBottom: "22px" },
  sectionLabel:{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" },
  sectionText:{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: "1.6" },
  textarea:   { width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13.5px", minHeight: "90px", resize: "vertical", boxSizing: "border-box", outline: "none" },
  statusGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" },
  statusBtn:  { padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#f8fafc", color: "#475569", cursor: "pointer", fontSize: "12.5px", fontWeight: "500", transition: "all 0.15s" },
  actions:    { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" },
  btnPrimary: { padding: "10px 22px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13.5px", fontWeight: "600" },
  btnSecondary:{ padding: "10px 18px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "7px", cursor: "pointer", fontSize: "13.5px" },
  btnDanger:  { padding: "10px 18px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "7px", cursor: "pointer", fontSize: "13.5px" },
  timeline:       { display: "flex", flexDirection: "column", gap: "0" },
  timelineItem:   { display: "flex", gap: "12px", position: "relative", paddingBottom: "14px" },
  timelineDot:    { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, marginTop: "4px" },
  timelineLine:   { position: "absolute", left: "4px", top: "14px", bottom: "0", width: "2px", background: "#e2e8f0" },
  timelineBody:   { display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "4px" },
  timelineText:   { fontSize: "13px", color: "#374151", lineHeight: 1.5 },
  timelineTime:   { fontSize: "11.5px", color: "#94a3b8" },
  sidebar:    { display: "flex", flexDirection: "column", gap: "14px" },
  sideCard:   { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "18px 20px" },
  sideTitle:  { fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" },
};

export default TicketDetail;
