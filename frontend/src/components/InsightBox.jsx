function InsightBox({ title, children }) {
  return (
    <div className="insight-box">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default InsightBox;