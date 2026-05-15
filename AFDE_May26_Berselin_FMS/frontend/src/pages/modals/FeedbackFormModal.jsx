import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import StarPicker from '../../components/StarPicker'
import { getFeedbackById, createFeedback, updateFeedback } from '../../services/feedbackService'
import { useToast } from '../../components/Toast'

const empty = { participant_name: '', program_name: '', rating: 0, comments: '' }

export default function FeedbackFormModal({ open, editId, onClose, onSaved }) {
  const [form, setForm]       = useState(empty)
  const [saving, setSaving]   = useState(false)
  const toast                 = useToast()

  useEffect(() => {
    if (!open) { setForm(empty); return }
    if (editId) {
      getFeedbackById(editId).then(r => {
        const f = r.data
        setForm({ participant_name: f.participant_name, program_name: f.program_name, rating: f.rating, comments: f.comments || '' })
      }).catch(() => {})
    }
  }, [open, editId])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) { toast('Please select a rating.', 'error'); return }
    setSaving(true)
    try {
      const payload = { ...form, rating: +form.rating, comments: form.comments || null }
      if (editId) { await updateFeedback(editId, payload); toast('Feedback updated!', 'success') }
      else        { await createFeedback(payload);          toast('Feedback submitted!', 'success') }
      onSaved()
      onClose()
    } catch (err) {
      toast(err.response?.data?.detail || 'Something went wrong.', 'error')
    } finally { setSaving(false) }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId ? 'Edit Feedback' : 'Submit Feedback'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : editId ? 'Save Changes' : 'Submit'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label>Participant Name *</label>
          <input value={form.participant_name} onChange={set('participant_name')} required maxLength={255} placeholder="e.g. Jane Doe" />
        </div>
        <div className="form-group">
          <label>Program / Event Name *</label>
          <input value={form.program_name} onChange={set('program_name')} required maxLength={255} placeholder="e.g. Leadership Workshop" />
        </div>
        <div className="form-group">
          <label>Rating *</label>
          <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
        </div>
        <div className="form-group">
          <label>Comments</label>
          <textarea value={form.comments} onChange={set('comments')} placeholder="Share your thoughts…" />
        </div>
      </form>
    </Modal>
  )
}
