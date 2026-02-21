export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>How to Use This App</h3>
          <button className="modal-close" onClick={onClose} title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body help-content">
          <section className="help-section">
            <h4>📤 Getting Started</h4>
            <ol>
              <li><strong>Download Template:</strong> Click "Download Sample Template" to get a CSV example</li>
              <li><strong>Upload CSV:</strong> Drag & drop or browse to select your CSV file</li>
              <li><strong>Generate:</strong> Click "Generate Presentation" to create slides</li>
            </ol>
          </section>

          <section className="help-section">
            <h4>🎯 Navigation</h4>
            <ul>
              <li><strong>Arrow Keys:</strong> Use ← → to navigate between slides</li>
              <li><strong>Buttons:</strong> Click "Prev" or "Next" in the control bar</li>
              <li><strong>Slide Counter:</strong> Shows "Slide X of Y" in the center</li>
            </ul>
          </section>

          <section className="help-section">
            <h4>🔤 Font Size Control</h4>
            <ul>
              <li><strong>A-</strong> button: Decrease font size (8 levels available)</li>
              <li><strong>A+</strong> button: Increase font size</li>
              <li><strong>Tip:</strong> Use larger sizes (6-8) for older viewers or projectors</li>
            </ul>
          </section>

          <section className="help-section">
            <h4>➕ Custom Slides</h4>
            <ol>
              <li>Navigate to any slide</li>
              <li>Click <strong>"Add Slide"</strong> button</li>
              <li>Enter title and content (one bullet per line)</li>
              <li>New slide appears after current slide</li>
            </ol>
          </section>

          <section className="help-section">
            <h4>📋 Activity Details</h4>
            <ul>
              <li><strong>Click any row</strong> in activity slides to see full details</li>
              <li>Modal shows complete information including Lokayat Activist and Sumup</li>
              <li>Click outside or × to close</li>
            </ul>
          </section>

          <section className="help-section">
            <h4>⌨️ Keyboard Shortcuts</h4>
            <table className="shortcuts-table">
              <tbody>
                <tr>
                  <td><kbd>←</kbd></td>
                  <td>Previous slide</td>
                </tr>
                <tr>
                  <td><kbd>→</kbd></td>
                  <td>Next slide</td>
                </tr>
                <tr>
                  <td><kbd>F</kbd></td>
                  <td>Toggle fullscreen</td>
                </tr>
                <tr>
                  <td><kbd>Esc</kbd></td>
                  <td>Exit fullscreen</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="help-section">
            <h4>💾 Data Persistence</h4>
            <ul>
              <li>Your presentation is automatically saved in browser storage</li>
              <li>Refresh the page - your work is preserved!</li>
              <li>Click <strong>"Restart"</strong> to clear all data and start fresh</li>
            </ul>
          </section>

          <section className="help-section">
            <h4>📥 Download PDF</h4>
            <ul>
              <li>Click <strong>"Download PDF"</strong> to save presentation as PDF</li>
              <li>All slides are included in the generated PDF</li>
              <li>Use for offline viewing or printing</li>
            </ul>
          </section>

          <section className="help-section">
            <h4>⛶ Fullscreen Mode</h4>
            <ul>
              <li>Click fullscreen button or press <kbd>F</kbd></li>
              <li>Perfect for presentations on projectors</li>
              <li>Press <kbd>Esc</kbd> to exit</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
