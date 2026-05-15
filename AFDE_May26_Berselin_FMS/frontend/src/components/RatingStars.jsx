import './RatingStars.css'

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export function RatingStars({ rating }) {
  return (
    <span className="stars">
      {'★'.repeat(rating)}
      <span className="stars-empty">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

export function RatingBadge({ rating }) {
  return <span className={`badge badge-${rating}`}>{LABELS[rating]}</span>
}

export function ratingLabel(r) { return LABELS[r] || '' }
