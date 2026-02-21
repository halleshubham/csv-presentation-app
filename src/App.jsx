import { useState, useEffect } from 'react';
import UploadScreen from './components/UploadScreen';
import PresentationView from './components/PresentationView';
import { parseCSV } from './utils/csvParser';

const STORAGE_KEY = 'csv-presentation-data';
const SLIDE_INDEX_KEY = 'csv-presentation-slide-index';
const FONT_SIZE_KEY = 'csv-presentation-font-size';
const CUSTOM_SLIDES_KEY = 'csv-presentation-custom-slides';

function App() {
  const [appState, setAppState] = useState('upload');
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const { slides: savedSlides } = JSON.parse(savedData);
        if (savedSlides && savedSlides.length > 0) {
          setSlides(savedSlides);
          setAppState('presentation');
        }
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleFileProcessed = async (file) => {
    try {
      setError('');
      const result = await parseCSV(file);
      setSlides(result.slides);
      setAppState('presentation');

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        slides: result.slides,
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file');
      setAppState('upload');
    }
  };

  const handleRestart = () => {
    // Clear all localStorage data except theme preference
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SLIDE_INDEX_KEY);
    localStorage.removeItem(FONT_SIZE_KEY);
    localStorage.removeItem(CUSTOM_SLIDES_KEY);
    // Keep theme preference - don't remove THEME_KEY

    setAppState('upload');
    setSlides([]);
    setError('');
  };

  return (
    <div className="app">
      {appState === 'upload' ? (
        <UploadScreen onFileProcessed={handleFileProcessed} />
      ) : (
        <PresentationView slides={slides} onRestart={handleRestart} />
      )}

      {error && appState === 'upload' && (
        <div className="app-error">
          <div className="error-content">
            <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
