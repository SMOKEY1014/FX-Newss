export default function EventCard({ event }) {
  return (
    <div className="card">
      <h2>{event.event}</h2>

      <p><strong>Bias:</strong> {event.bias}</p>
      <p><strong>Confidence:</strong> {event.confidence}%</p>
      <p><strong>Actual:</strong> {event.actual}</p>
      <p><strong>Forecast:</strong> {event.forecast}</p>
      <p><strong>Previous:</strong> {event.previous}</p>
      <p><strong>Strength:</strong> {event.strength}</p>
      <p>{event.context}</p>

      <div className="footer">
        <span>DXY: {event.dxy_est}</span>
        <span>Gold: {event.gold_est}</span>
      </div>
    </div>
  )
}
