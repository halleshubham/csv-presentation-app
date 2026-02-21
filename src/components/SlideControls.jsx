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
  onHelp,
  onDownloadPDF,
  isGeneratingPDF
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
      <div className="slide-controls">
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

        <button
          className="control-button download-pdf-button"
          onClick={onDownloadPDF}
          disabled={isGeneratingPDF}
          title="Download presentation as PDF"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
        </button>

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
