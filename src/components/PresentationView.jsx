import { useState, useEffect } from 'react';
import SlideControls from './SlideControls';
import SlideRenderer from './SlideRenderer';
import AddSlideModal from './AddSlideModal';
import HelpModal from './HelpModal';

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
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  const handleOpenHelp = () => {
    setShowHelpModal(true);
  };

  const handleCloseHelp = () => {
    setShowHelpModal(false);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // Use browser's print functionality for better PDF generation
      const printWindow = window.open('', '_blank');

      if (!printWindow) {
        alert('Please allow popups to download PDF');
        setIsGeneratingPDF(false);
        return;
      }

      // Build HTML content for all slides
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Presentation</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif, 'Noto Sans Devanagari';
              font-size: ${getFontSize(fontSize)};
              line-height: 1.6;
              color: #000;
            }

            .slide-page {
              page-break-after: always;
              padding: 40px;
              min-height: 100vh;
            }

            .slide-page:last-child {
              page-break-after: auto;
            }

            .slide-title {
              font-size: ${getTitleSize(fontSize)};
              font-weight: 700;
              margin-bottom: 30px;
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: ${getTableSize(fontSize)};
            }

            th {
              background-color: #f0f0f0;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              border: 1px solid #ddd;
            }

            td {
              padding: 10px 12px;
              border: 1px solid #ddd;
            }

            tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }

            .total-row {
              background-color: #e0e0e0 !important;
              font-weight: 700;
            }

            .bullet-list {
              list-style-type: disc;
              padding-left: 40px;
              margin-top: 20px;
            }

            .bullet-list li {
              margin-bottom: 15px;
              line-height: 1.8;
            }

            @media print {
              .slide-page {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          ${generateAllSlidesHTML()}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          setIsGeneratingPDF(false);
        }, 500);
      }, 500);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  const getFontSize = (size) => {
    const sizes = {
      'size-1': '14px', 'size-2': '16px', 'size-3': '18px', 'size-4': '20px',
      'size-5': '22px', 'size-6': '24px', 'size-7': '26px', 'size-8': '28px'
    };
    return sizes[size] || '20px';
  };

  const getTitleSize = (size) => {
    const sizes = {
      'size-1': '24px', 'size-2': '28px', 'size-3': '32px', 'size-4': '36px',
      'size-5': '40px', 'size-6': '44px', 'size-7': '48px', 'size-8': '52px'
    };
    return sizes[size] || '36px';
  };

  const getTableSize = (size) => {
    const sizes = {
      'size-1': '12px', 'size-2': '14px', 'size-3': '16px', 'size-4': '18px',
      'size-5': '20px', 'size-6': '22px', 'size-7': '24px', 'size-8': '26px'
    };
    return sizes[size] || '18px';
  };

  const generateAllSlidesHTML = () => {
    return slides.map((slide, index) => {
      let content = '';

      if (slide.type === 'summary') {
        content = `
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Activity Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              ${slide.data.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.activityType}</td>
                  <td>${item.count}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>${slide.total}</strong></td>
              </tr>
            </tbody>
          </table>
        `;
      } else if (slide.type === 'participants') {
        content = `
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Participant Name</th>
                <th>Total Attendance</th>
                <th>Activity Breakdown</th>
              </tr>
            </thead>
            <tbody>
              ${slide.data.map((participant, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${participant.name}</td>
                  <td>${participant.totalAttendance}</td>
                  <td>${Object.entries(participant.activities)
                    .map(([type, count]) => `${type}: ${count}`)
                    .join(', ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else if (slide.type === 'activity') {
        content = `
          <table>
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
              ${slide.data.map((row, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${row['Activity Date'] || '—'}</td>
                  <td>${row['Activity Topic'] || '—'}</td>
                  <td>${row['Location'] || '—'}</td>
                  <td>${row['Co ordinator'] || '—'}</td>
                  <td>${row['New Contact Names'] || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else if (slide.type === 'custom') {
        const bulletPoints = slide.content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        content = `
          <ul class="bullet-list">
            ${bulletPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        `;
      }

      return `
        <div class="slide-page">
          <h2 class="slide-title">${slide.title}</h2>
          ${content}
        </div>
      `;
    }).join('');
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
        onHelp={handleOpenHelp}
        onDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
      />

      {showAddSlideModal && (
        <AddSlideModal
          onClose={handleCloseAddSlide}
          onAdd={handleAddSlide}
        />
      )}

      {showHelpModal && (
        <HelpModal onClose={handleCloseHelp} />
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
