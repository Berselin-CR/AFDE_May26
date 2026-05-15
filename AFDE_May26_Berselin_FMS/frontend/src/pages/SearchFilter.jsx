import { useEffect, useState } from 'react'
import { searchFeedback, getAllFeedback } from '../services/feedbackService'
import { RatingStars, RatingBadge } from '../components/RatingStars'
import { useAuth } from '../services/AuthContext'
import DetailModal from './modals/DetailModal'
import FeedbackFormModal from './modals/FeedbackFormModal'
import DeleteModal from './modals/DeleteModal'
import './SearchFilter.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function SearchFilter() {
  const [keyword, setKeyword]   = useState('')
  const [program, setProgram]   = useState('')
  const [rating, setRating]     = useState('')
  const [programs, setPrograms] = useState([])
  const [results, setResults]   = useState(null)
  const [searching, setSearching] = useState(false)
  const [detailId, setDetailId]   = useState(null)
  const [editId, setEditId]       = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [formOpen, setFormOpen]   = useState(false)
  const { isAdmin } = useAuth()

  useEffect(() => {
    getAllFeedback().then(r => {
      const unique = [...new Set(r.data.map(f => f.program_name))].sort()
      setPrograms(unique)
    }).catch(() => {})
  }, [])

  const handleSearch = async () => {
    setSearching(true)
    try {
      const params = {}
      if (keyword.trim()) params.keyword = keyword.trim()
      if (program)        params.program_name = program
      if (rating)         params.rating = +rating
      const r = await searchFeedback(params)
      setResults(r.data)
    } catch { setResults([]) } finally { setSearching(false) }
  }

  const handleClear = () => {
    setKeyword(''); setProgram(''); setRating(''); setResults(null)
  }

  const openEdit = (id) => { setEditId(id); setFormOpen(true) }

  return (
    <>
      <div className="page-header">
        <h1>Search & Filter</h1>
        <p>Find feedback by keyword, rating, or program name</p>
      </div>

      <div className="search-bar">
        <div className="form-group search-field">
          <label>Keyword</label>
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Name, program, or comment…" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        </div>
        <div className="form-group search-field">
          <label>Program / Event</label>
          <select value={program} onChange={e => setProgram(e.target.value)}>
            <option value="">All programs</option>
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group search-field-sm">
          <label>Rating</label>
          <select value={rating} onChange={e => setRating(e.target.value)}>
            <option value="">Any rating</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </div>
        <div className="search-actions">
          <button className="btn btn-primary" onClick={handleSearch} disabled={searching}>{searching ? 'Searching…' : 'Search'}</button>
          <button className="btn btn-ghost" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Results</h2>
          {results !== null && <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{results.length} result{results.length !== 1 ? 's' : ''}</span>}
        </div>
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ minWidth: '750px' }}>
            <thead>
              <tr><th>#</th><th>Participant</th><th>Program</th><th>Rating</th><th>Comments</th><th>Submitted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {results === null ? (
                <tr><td colSpan={7}><div className="empty"><div className="empty-icon">🔍</div><p>Enter filters above and press Search.</p></div></td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={7}><div className="empty"><div className="empty-icon">📭</div><p>No results found.</p></div></td></tr>
              ) : results.map(f => (
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
      <FeedbackFormModal open={formOpen} editId={editId} onClose={() => setFormOpen(false)} onSaved={handleSearch} />
      <DeleteModal id={deleteId} onClose={() => setDeleteId(null)} onDeleted={handleSearch} />
    </>
  )
}
