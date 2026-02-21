export default function ParticipantsSlide({ slide }) {
  const formatActivityBreakdown = (activities) => {
    return Object.entries(activities)
      .map(([activityType, count]) => `${activityType}: ${count}`)
      .join(', ');
  };

  return (
    <div className="slide">
      <h2 className="slide-title">{slide.title}</h2>
      <div className="table-container">
        <table className="slide-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Participant Name</th>
              <th>Total Attendance</th>
              <th>Activity Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {slide.data.map((participant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{participant.name}</td>
                <td>{participant.totalAttendance}</td>
                <td>{formatActivityBreakdown(participant.activities)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
