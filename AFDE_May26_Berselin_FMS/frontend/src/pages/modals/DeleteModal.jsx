import Modal from '../../components/Modal'
import { deleteFeedback } from '../../services/feedbackService'
import { useToast } from '../../components/Toast'
import { useState } from 'react'

export default function DeleteModal({ id, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteFeedback(id)
      toast('Feedback deleted.', 'success')
      onDeleted()
      onClose()
    } catch (err) {
      toast(err.response?.data?.detail || 'Delete failed.', 'error')
    } finally { setDeleting(false) }
  }

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title="Confirm Delete"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
        Are you sure you want to delete this feedback entry? This action cannot be undone.
      </p>
    </Modal>
  )
}
