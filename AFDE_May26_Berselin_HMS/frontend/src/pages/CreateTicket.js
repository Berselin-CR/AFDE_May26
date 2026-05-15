import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["VPN Issue", "Password Reset", "Software Installation", "Laptop Issue", "Email Access", "Network Connectivity", "Hardware Request", "Other"];
const PRIORITIES  = ["Low", "Medium", "High", "Critical"];
const PRIORITY_DESC = { Low: "Non-urgent, can wait", Medium: "Needs attention soon", High: "Urgent issue", Critical: "System down / blocking work" };
const priorityColor = { Low: "#16a34a", Medium: "#d97706", High: "#dc2626", Critical: "#7c3aed" };

const CreateTicket = () => {
  const navigate  = useNavigate();
  const { auth }  = useAuth();
  const [form, setForm]     = useState({ employee_name: "", department: "", issue_category: "", description: "", priority: "Medium" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth?.role === "support_admin") { navigate("/tickets", { replace: true }); return; }
    setForm((f) => ({ ...f, employee_name: auth?.username || "" }));
  }, [auth, navigate]);

  const validate = () => {
    const e = {};
    if (!form.employee_name.trim()) e.employee_name = "Name is required";
    if (!form.department.trim())    e.department    = "Department is required";
    if (!form.issue_category)       e.issue_category = "Please select a category";
    if (form.description.trim().length < 5) e.description = "At least 5 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try { await createTicket(form); navigate("/tickets"); }
    catch { setSubmitting(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
        <h1 style={s.title}>Raise a Support Ticket</h1>
        <p style={s.sub}>Fill in the details below and our support team will get back to you.</p>
      </div>

      <div style={s.layout}>
        {/* Form */}
        <div style={s.card}>
          <div style={s.formGrid}>
            <Field label="Employee Name" error={errors.employee_name}>
              <input style={{ ...s.input, ...s.readonly }} value={form.employee_name} readOnly />
            </Field>
            <Field label="Department" error={errors.department}>
              <input style={s.input} name="department" placeholder="e.g. IT, HR, Finance" value={form.department} onChange={handleChange} />
            </Field>
          </div>

          <Field label="Issue Category" error={errors.issue_category}>
            <select style={s.input} name="issue_category" value={form.issue_category} onChange={handleChange}>
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <div style={s.fieldGroup}>
            <label style={s.label}>Priority</label>
            <div style={s.priorityGrid}>
              {PRIORITIES.map((p) => {
                const active = form.priority === p;
                const color  = priorityColor[p];
                return (
                  <button key={p}
                    style={{ ...s.priorityBtn, ...(active ? { background: color, color: "#fff", borderColor: color } : {}) }}
                    onClick={() => setForm({ ...form, priority: p })}
                  >
                    <div style={{ fontWeight: "700", fontSize: "13px" }}>{p}</div>
                    <div style={{ fontSize: "10.5px", opacity: active ? 0.9 : 0.6, marginTop: "2px" }}>{PRIORITY_DESC[p]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Description" error={errors.description}>
            <textarea style={{ ...s.input, height: "110px", resize: "vertical" }} name="description"
              placeholder="Describe the issue in detail…" value={form.description} onChange={handleChange} />
          </Field>

          <div style={s.actions}>
            <button style={s.btnSecondary} onClick={() => navigate("/tickets")}>Cancel</button>
            <button style={s.btnPrimary}   onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Ticket"}
            </button>
          </div>
        </div>

        {/* Tips sidebar */}
        <div style={s.tips}>
          <div style={s.tipTitle}>💡 Tips for a faster resolution</div>
          <ul style={s.tipList}>
            <li>Be specific — mention error messages or steps to reproduce.</li>
            <li>Choose the correct category so the right team gets notified.</li>
            <li>Use <strong>Critical</strong> only if work is completely blocked.</li>
            <li>Check All Tickets first — your issue may already be reported.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: "18px" }}>
    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>{label}</label>
    {children}
    {error && <span style={{ fontSize: "11.5px", color: "#dc2626", marginTop: "4px", display: "block" }}>{error}</span>}
  </div>
);

const s = {
  page:        { padding: "28px 32px", maxWidth: "960px", margin: "0 auto" },
  header:      { marginBottom: "24px" },
  back:        { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px", padding: 0, marginBottom: "12px", display: "block" },
  title:       { fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub:         { fontSize: "13px", color: "#64748b", margin: 0 },
  layout:      { display: "grid", gridTemplateColumns: "1fr 240px", gap: "20px", alignItems: "start" },
  card:        { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "28px" },
  formGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  fieldGroup:  { marginBottom: "18px" },
  label:       { display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
  input:       { width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: "7px", fontSize: "13.5px", boxSizing: "border-box", outline: "none", background: "#fff" },
  readonly:    { background: "#f8fafc", color: "#64748b", cursor: "not-allowed" },
  priorityGrid:{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" },
  priorityBtn: { padding: "10px 8px", border: "1px solid #e2e8f0", borderRadius: "7px", background: "#f8fafc", color: "#475569", cursor: "pointer", textAlign: "center", transition: "all 0.15s" },
  actions:     { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" },
  btnPrimary:  { padding: "11px 28px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  btnSecondary:{ padding: "11px 20px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "7px", cursor: "pointer", fontSize: "14px" },
  tips:        { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "20px" },
  tipTitle:    { fontSize: "13px", fontWeight: "700", color: "#1e40af", marginBottom: "12px" },
  tipList:     { margin: 0, padding: "0 0 0 16px", fontSize: "12.5px", color: "#3b82f6", lineHeight: "1.8" },
};

export default CreateTicket;
