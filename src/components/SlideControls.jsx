import { useState, useEffect } from 'react';

export default function SlideControls({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onRestart,
  onIncreaseFontSize,
  onDecreaseFontSize,
  canIncrease,
  canDecrease,
  onAddSlide,
  onEditSlide,
  onDeleteSlide,
  isCustomSlide,
  onHelp,
  onDownloadClick,
  onDownloadPDF,
  onDownloadJSON,
  isGeneratingPDF,
  showDownloadMenu,
  theme,
  onToggleTheme
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showConfirm) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (currentSlide > 0) onPrevious();
          break;
        case 'ArrowRight':
          if (currentSlide < totalSlides - 1) onNext();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides, onPrevious, onNext, isFullscreen, showConfirm]);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleRestartClick = () => {
    setShowConfirm(true);
  };

  const confirmRestart = () => {
    setShowConfirm(false);
    onRestart();
  };

  const cancelRestart = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className={`slide-controls ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        <button
          className="control-button"
          onClick={onPrevious}
          disabled={currentSlide === 0}
          title="Previous slide (←)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Prev</span>
        </button>

        <div className="slide-indicator">
          Slide {currentSlide + 1} of {totalSlides}
        </div>

        <button
          className="control-button"
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          title="Next slide (→)"
        >
          <span>Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="control-divider" />

        <button
          className="control-button"
          onClick={onDecreaseFontSize}
          disabled={!canDecrease}
          title="Decrease font size"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M9 12h6M12 17h.01" />
          </svg>
          <span className="font-size-label">A-</span>
        </button>

        <button
          className="control-button"
          onClick={onIncreaseFontSize}
          disabled={!canIncrease}
          title="Increase font size"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M8 12h8M10 17h4" />
          </svg>
          <span className="font-size-label">A+</span>
        </button>

        <div className="control-divider" />

        <button
          className="control-button add-slide-button"
          onClick={onAddSlide}
          title="Add custom slide after current slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add Slide</span>
        </button>

        {isCustomSlide && (
          <>
            <button
              className="control-button edit-slide-button"
              onClick={onEditSlide}
              title="Edit this custom slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit</span>
            </button>

            <button
              className="control-button delete-slide-button"
              onClick={onDeleteSlide}
              title="Delete this custom slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              <span>Delete</span>
            </button>
          </>
        )}

        <div className="control-divider" />

        <button
          className="control-button theme-toggle-button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        <div className="control-divider" />

        <button
          className="control-button help-button"
          onClick={onHelp}
          title="How to use this app"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
          <span>Help</span>
        </button>

        <div className="download-dropdown">
          <button
            className="control-button download-button"
            onClick={onDownloadClick}
            disabled={isGeneratingPDF}
            title="Download presentation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>{isGeneratingPDF ? 'Generating...' : 'Download'}</span>
            <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showDownloadMenu && (
            <div className="download-menu">
              <button className="download-menu-item" onClick={onDownloadPDF}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                <div className="menu-item-text">
                  <span className="menu-item-title">Download as PDF</span>
                  <span className="menu-item-desc">Print-ready document</span>
                </div>
              </button>
              <button className="download-menu-item" onClick={onDownloadJSON}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M10 12h4M10 16h4M10 8h1" />
                </svg>
                <div className="menu-item-text">
                  <span className="menu-item-title">Download as JSON</span>
                  <span className="menu-item-desc">Editable data file</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="control-divider" />

        <button
          className="control-button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          )}
        </button>

        <button
          className="control-button restart-button"
          onClick={handleRestartClick}
          title="Restart application"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          <span>Restart</span>
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={cancelRestart}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Restart Application?</h3>
            <p>This will clear all data and edits. Continue?</p>
            <div className="confirm-buttons">
              <button className="confirm-cancel" onClick={cancelRestart}>
                Cancel
              </button>
              <button className="confirm-ok" onClick={confirmRestart}>
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
