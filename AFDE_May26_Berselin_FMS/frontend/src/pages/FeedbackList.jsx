import { useEffect, useState } from 'react'
import { getAllFeedback } from '../services/feedbackService'
import { RatingStars, RatingBadge } from '../components/RatingStars'
import { useAuth } from '../services/AuthContext'
import DetailModal from './modals/DetailModal'
import FeedbackFormModal from './modals/FeedbackFormModal'
import DeleteModal from './modals/DeleteModal'
import './FeedbackList.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function FeedbackList() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [detailId, setDetailId]   = useState(null)
  const [editId, setEditId]       = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [formOpen, setFormOpen]   = useState(false)
  const { isAdmin } = useAuth()

  const load = () => {
    setLoading(true)
    getAllFeedback().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openEdit = (id) => { setEditId(id); setFormOpen(true) }
  const openCreate = () => { setEditId(null); setFormOpen(true) }

  return (
    <>
      <div className="page-header-row">
        <div className="page-header">
          <h1>All Feedback</h1>
          <p>Browse and manage every feedback entry</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Submit New</button>
      </div>

      {!isAdmin && (
        <div className="access-banner">
          🔒 You are signed in as <strong>&nbsp;User&nbsp;</strong>. Editing and deleting requires Administrator access.
        </div>
      )}

      <div className="card">
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ minWidth: '750px' }}>
            <thead>
              <tr>
                <th>#</th><th>Participant</th><th>Program</th>
                <th>Rating</th><th>Comments</th><th>Submitted</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div></td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7}><div className="empty"><div className="empty-icon">📭</div><p>No feedback found.</p></div></td></tr>
              ) : data.map(f => (
                <tr key={f.feedback_id}>
                  <td style={{ color: 'var(--muted)', fontSize: '.8rem' }}>#{f.feedback_id}</td>
                  <td><strong>{f.participant_name}</strong></td>
                  <td>{f.program_name}</td>
                  <td><RatingStars rating={f.rating} /> <RatingBadge rating={f.rating} /></td>
                  <td style={{ maxWidth: '300px', wordWrap: 'break-word', whiteSpace: 'normal' }}>{f.comments || '—'}</td>
                  <td style={{ fontSize: '.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{formatDate(f.submitted_at)}</td>
                  <td>
                    <div className="action-row">
                      <button className="btn btn-sm btn-edit" onClick={() => setDetailId(f.feedback_id)}>View</button>
                      {isAdmin && <button className="btn btn-sm btn-edit" onClick={() => openEdit(f.feedback_id)}>Edit</button>}
                      {isAdmin && <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(f.feedback_id)}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DetailModal id={detailId} onClose={() => setDetailId(null)} onEdit={openEdit} />
      <FeedbackFormModal open={formOpen} editId={editId} onClose={() => setFormOpen(false)} onSaved={load} />
      <DeleteModal id={deleteId} onClose={() => setDeleteId(null)} onDeleted={load} />
    </>
  )
}
