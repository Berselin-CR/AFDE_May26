import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllFeedback } from '../services/feedbackService'
import FeedbackCard from '../components/FeedbackCard'
import { RatingStars } from '../components/RatingStars'
import DetailModal from './modals/DetailModal'
import './Dashboard.css'

function getProgramStats(data) {
  const map = {}
  data.forEach(f => {
    const key = f.program_name.trim().toLowerCase()
    if (!map[key]) map[key] = { name: f.program_name.trim(), sum: 0, count: 0 }
    map[key].sum   += f.rating
    map[key].count += 1
  })
  return Object.values(map)
    .map(s => ({ name: s.name, count: s.count, avg: (s.sum / s.count).toFixed(1) }))
    .sort((a, b) => b.avg - a.avg)
}

function AvgBar({ avg }) {
  const pct = (avg / 5) * 100
  const color = avg >= 4 ? '#10b981' : avg >= 3 ? '#f59e0b' : '#ef4444'
  return (
    <div className="avg-bar-wrap">
      <div className="avg-bar" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export default function Dashboard() {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [detailId, setDetailId] = useState(null)
  const navigate                = useNavigate()

  useEffect(() => {
    getAllFeedback()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total       = data.length
  const avg         = total ? (data.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : '—'
  const fiveStar    = data.filter(f => f.rating === 5).length
  const programStats = getProgramStats(data)

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of all collected feedback</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div><div className="stat-label">Total Feedback</div><div className="stat-value">{loading ? '—' : total}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold">⭐</div>
          <div><div className="stat-label">Average Rating</div><div className="stat-value">{loading ? '—' : total ? `${avg} ★` : '—'}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🏆</div>
          <div><div className="stat-label">5-Star Entries</div><div className="stat-value">{loading ? '—' : fiveStar}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">📌</div>
          <div><div className="stat-label">Programs Covered</div><div className="stat-value">{loading ? '—' : programStats.length}</div></div>
        </div>
      </div>

      <div className="dashboard-grid">

        {/* Program Average Ratings */}
        <div className="card">
          <div className="card-header"><h2>Average Rating by Program</h2></div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>
            ) : programStats.length === 0 ? (
              <div className="empty"><div className="empty-icon">📭</div><p>No programs yet.</p></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Program / Event</th>
                    <th>Responses</th>
                    <th>Avg Rating</th>
                    <th style={{ minWidth: 120 }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {programStats.map(p => (
                    <tr key={p.name}>
                      <td><strong>{p.name}</strong></td>
                      <td style={{ color: 'var(--muted)' }}>{p.count} {p.count === 1 ? 'response' : 'responses'}</td>
                      <td>
                        <span style={{ fontWeight: 700, marginRight: '.4rem' }}>{p.avg}</span>
                        <RatingStars rating={Math.round(p.avg)} />
                      </td>
                      <td><AvgBar avg={+p.avg} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Feedback</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/feedback')}>View All →</button>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>
            ) : data.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <p>No feedback yet. <span className="link" onClick={() => navigate('/feedback/submit')}>Submit the first one!</span></p>
              </div>
            ) : (
              <div className="recent-list">
                {data.slice(0, 8).map(f => (
                  <FeedbackCard key={f.feedback_id} feedback={f} onClick={() => setDetailId(f.feedback_id)} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <DetailModal id={detailId} onClose={() => setDetailId(null)} />
    </>
  )
}
