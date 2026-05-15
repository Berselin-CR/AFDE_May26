import './FeedbackCard.css'

export default function FeedbackCard({ feedback, onClick }) {
  const initial = feedback.participant_name?.[0]?.toUpperCase() || '?'
  return (
    <div className="feedback-card" onClick={onClick}>
      <div className="fc-avatar">{initial}</div>
      <div className="fc-info">
        <div className="fc-name">{feedback.participant_name}</div>
        <div className="fc-program">{feedback.program_name}</div>
      </div>
      <div className="fc-stars">{'★'.repeat(feedback.rating)}</div>
    </div>
  )
}
