export default function SummarySlide({ slide }) {
  return (
    <div className="slide">
      <h2 className="slide-title">{slide.title}</h2>
      <div className="table-container">
        <table className="slide-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Activity Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {slide.data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.activityType}</td>
                <td>{item.count}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2"><strong>Total</strong></td>
              <td><strong>{slide.total}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
