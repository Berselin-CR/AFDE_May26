import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import { RatingStars, RatingBadge } from '../../components/RatingStars'
import { getFeedbackById } from '../../services/feedbackService'
import { useAuth } from '../../services/AuthContext'
import './DetailModal.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function DetailModal({ id, onClose, onEdit }) {
  const [feedback, setFeedback] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    if (!id) { setFeedback(null); return }
    getFeedbackById(id).then(r => setFeedback(r.data)).catch(() => {})
  }, [id])

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title="Feedback Detail"
      footer={
        <>
          {isAdmin && onEdit && <button className="btn btn-edit" onClick={() => { onClose(); onEdit(id) }}>Edit</button>}
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </>
      }
    >
      {!feedback ? (
        <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>
      ) : (
        <div className="detail-rows">
          <div className="detail-row"><span className="detail-label">ID</span><span>#{feedback.feedback_id}</span></div>
          <div className="detail-row"><span className="detail-label">Participant</span><span>{feedback.participant_name}</span></div>
          <div className="detail-row"><span className="detail-label">Program</span><span>{feedback.program_name}</span></div>
          <div className="detail-row"><span className="detail-label">Rating</span><span><RatingStars rating={feedback.rating} /> <RatingBadge rating={feedback.rating} /></span></div>
          <div className="detail-row"><span className="detail-label">Comments</span><span>{feedback.comments || '—'}</span></div>
          <div className="detail-row"><span className="detail-label">Submitted At</span><span>{formatDate(feedback.submitted_at)}</span></div>
        </div>
      )}
    </Modal>
  )
}
