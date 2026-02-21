import { useState } from 'react';

export default function ActivitySlide({ slide }) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row, index) => {
    setSelectedRow({ ...row, index: index + 1 });
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  return (
    <div className="slide">
      <h2 className="slide-title">{slide.title}</h2>
      <div className="activity-table-container">
        <table className="slide-table activity-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Activity Date</th>
              <th>Activity Topic</th>
              <th>Location</th>
              <th>Co ordinator</th>
              <th>New Contact Names</th>
            </tr>
          </thead>
          <tbody>
            {slide.data.map((row, index) => (
              <tr
                key={index}
                className="clickable-row"
                onClick={() => handleRowClick(row, index)}
                title="Click to view details"
              >
                <td>{index + 1}</td>
                <td>{row['Activity Date'] || '—'}</td>
                <td>{row['Activity Topic'] || '—'}</td>
                <td>{row['Location'] || '—'}</td>
                <td>{row['Co ordinator'] || '—'}</td>
                <td>{row['New Contact Names'] || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRow && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Activity Details #{selectedRow.index}</h3>
              <button className="modal-close" onClick={closeModal} title="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Activity Type:</span>
                <span className="detail-value">{slide.activityType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Activity Date:</span>
                <span className="detail-value">{selectedRow['Activity Date'] || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Activity Topic:</span>
                <span className="detail-value">{selectedRow['Activity Topic'] || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{selectedRow['Location'] || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Co ordinator:</span>
                <span className="detail-value">{selectedRow['Co ordinator'] || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">New Contact Names:</span>
                <span className="detail-value">{selectedRow['New Contact Names'] || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lokayat Activist:</span>
                <span className="detail-value">{selectedRow['Lokayat Activist'] || '—'}</span>
              </div>
              <div className="detail-row full-width">
                <span className="detail-label">Sumup:</span>
                <div className="detail-value sumup-content">{selectedRow['Sumup'] || '—'}</div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Team Name:</span>
                <span className="detail-value">{selectedRow['Team Name'] || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
