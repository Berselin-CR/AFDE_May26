import { useState } from 'react'
import StarPicker from '../components/StarPicker'
import { createFeedback } from '../services/feedbackService'
import { useToast } from '../components/Toast'
import './FeedbackForm.css'

const empty = { participant_name: '', program_name: '', rating: 0, comments: '' }

export default function SubmitFeedback() {
  const [form, setForm]     = useState(empty)
  const [saving, setSaving] = useState(false)
  const toast               = useToast()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) { toast('Please select a rating.', 'error'); return }
    setSaving(true)
    try {
      await createFeedback({ ...form, rating: +form.rating, comments: form.comments || null })
      toast('Feedback submitted successfully!', 'success')
      setForm(empty)
    } catch (err) {
      toast(err.response?.data?.detail || 'Something went wrong.', 'error')
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <h1>Submit Feedback</h1>
        <p>Share your experience with a program or event</p>
      </div>
      <div className="card form-card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Participant Name *</label>
                <input value={form.participant_name} onChange={set('participant_name')} required maxLength={255} placeholder="e.g. Jane Doe" />
              </div>
              <div className="form-group">
                <label>Program / Event Name *</label>
                <input value={form.program_name} onChange={set('program_name')} required maxLength={255} placeholder="e.g. Leadership Workshop" />
              </div>
              <div className="form-group form-full">
                <label>Rating *</label>
                <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>
              <div className="form-group form-full">
                <label>Comments</label>
                <textarea value={form.comments} onChange={set('comments')} placeholder="Share your thoughts…" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Submitting…' : 'Submit Feedback'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setForm(empty)}>Clear</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
