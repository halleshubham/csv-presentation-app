import { useState, useEffect } from 'react';
import SlideControls from './SlideControls';
import SlideRenderer from './SlideRenderer';
import AddSlideModal from './AddSlideModal';

const SLIDE_INDEX_KEY = 'csv-presentation-slide-index';
const FONT_SIZE_KEY = 'csv-presentation-font-size';
const CUSTOM_SLIDES_KEY = 'csv-presentation-custom-slides';

export default function PresentationView({ slides: initialSlides, onRestart }) {
  // Merge initial slides with custom slides from localStorage
  const [slides, setSlides] = useState(() => {
    try {
      const savedCustomSlides = localStorage.getItem(CUSTOM_SLIDES_KEY);
      if (savedCustomSlides) {
        const customSlides = JSON.parse(savedCustomSlides);
        // Merge custom slides back into the slides array at their saved positions
        return mergeSlidesWithCustom(initialSlides, customSlides);
      }
    } catch (err) {
      console.error('Error loading custom slides:', err);
    }
    return initialSlides;
  });

  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  // Load saved state from localStorage
  const [currentSlide, setCurrentSlide] = useState(() => {
    try {
      const saved = localStorage.getItem(SLIDE_INDEX_KEY);
      const index = saved ? parseInt(saved, 10) : 0;
      return index >= 0 && index < slides.length ? index : 0;
    } catch {
      return 0;
    }
  });

  const [fadeClass, setFadeClass] = useState('');

  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_KEY);
      return saved || 'size-4';
    } catch {
      return 'size-4';
    }
  });

  // Save current slide to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SLIDE_INDEX_KEY, currentSlide.toString());
  }, [currentSlide]);

  // Save font size to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      transitionSlide(() => setCurrentSlide(currentSlide + 1));
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      transitionSlide(() => setCurrentSlide(currentSlide - 1));
    }
  };

  const increaseFontSize = () => {
    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7', 'size-8'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7', 'size-8'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const transitionSlide = (callback) => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      callback();
      return;
    }

    setFadeClass('fade-out');
    setTimeout(() => {
      callback();
      setFadeClass('fade-in');
      setTimeout(() => setFadeClass(''), 150);
    }, 150);
  };

  const handleAddSlide = (slideData) => {
    const newSlide = {
      ...slideData,
      id: Date.now(), // Unique ID for the custom slide
      customSlideIndex: currentSlide + 1 // Position where it was inserted
    };

    // Insert the new slide after the current slide
    const newSlides = [
      ...slides.slice(0, currentSlide + 1),
      newSlide,
      ...slides.slice(currentSlide + 1)
    ];

    setSlides(newSlides);

    // Save custom slides to localStorage
    const customSlides = newSlides
      .map((slide, index) => ({ ...slide, absoluteIndex: index }))
      .filter(slide => slide.type === 'custom');
    localStorage.setItem(CUSTOM_SLIDES_KEY, JSON.stringify(customSlides));

    // Move to the newly created slide
    transitionSlide(() => setCurrentSlide(currentSlide + 1));
  };

  const handleOpenAddSlide = () => {
    setShowAddSlideModal(true);
  };

  const handleCloseAddSlide = () => {
    setShowAddSlideModal(false);
  };

  return (
    <div className="presentation-view">
      <div className={`slide-canvas ${fadeClass} font-${fontSize}`}>
        <SlideRenderer
          slide={slides[currentSlide]}
        />
      </div>
      <SlideControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onRestart={onRestart}
        fontSize={fontSize}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        canIncrease={fontSize !== 'size-8'}
        canDecrease={fontSize !== 'size-1'}
        onAddSlide={handleOpenAddSlide}
      />

      {showAddSlideModal && (
        <AddSlideModal
          onClose={handleCloseAddSlide}
          onAdd={handleAddSlide}
        />
      )}
    </div>
  );
}

// Helper function to merge initial slides with saved custom slides
function mergeSlidesWithCustom(initialSlides, customSlides) {
  if (!customSlides || customSlides.length === 0) {
    return initialSlides;
  }

  const result = [...initialSlides];

  // Sort custom slides by their absolute index
  const sortedCustom = [...customSlides].sort((a, b) => a.absoluteIndex - b.absoluteIndex);

  // Insert custom slides at their saved positions
  sortedCustom.forEach(customSlide => {
    const insertIndex = Math.min(customSlide.absoluteIndex, result.length);
    result.splice(insertIndex, 0, customSlide);
  });

  return result;
}
