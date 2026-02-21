import { useState } from 'react';

export default function AddSlideModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!title.trim()) {
      alert('Please enter a title for the slide');
      return;
    }

    onAdd({
      type: 'custom',
      title: title.trim(),
      content: content.trim()
    });

    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-content add-slide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Custom Slide</h3>
          <button className="modal-close" onClick={onClose} title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="slide-title" className="form-label">
              Slide Title <span className="required">*</span>
            </label>
            <input
              id="slide-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter slide title..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="slide-content" className="form-label">
              Content
              <span className="form-hint">(Each line will be a bullet point)</span>
            </label>
            <textarea
              id="slide-content"
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content... (one bullet point per line)&#10;Example:&#10;First point&#10;Second point&#10;Third point"
              rows={10}
            />
          </div>

          <div className="modal-actions">
            <button className="button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="button-primary" onClick={handleAdd}>
              Add Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
