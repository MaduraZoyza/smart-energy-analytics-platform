function SummaryCard({ title, value, note }) {
  return (
    <div className="summary-card">
      <p className="card-title">{title}</p>
      <h3>{value}</h3>
      <p className="card-note">{note}</p>
    </div>
  );
}

export default SummaryCard;