import { useState, useRef } from 'react';

export default function UploadScreen({ onFileProcessed }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) {
      return 'No file selected';
    }
    if (!file.name.endsWith('.csv')) {
      return 'Please select a CSV file (.csv)';
    }
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    const file = e.dataTransfer.files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError('');

    const file = e.target.files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setError('');
    onFileProcessed(selectedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    // CSV template with headers and sample rows
    const csvContent = `Activity Date,Team Name,Activity Topic,Activity Type,Location,Co ordinator,New Contact Names,Lokayat Activist,Sumup
2024-01-15,लोकायत टीम,सांस्कृतिक कार्यक्रम,Cultural Practice,पुणे,राज कुमार,"प्रज्ञा, सुनीता, अनिल",महेश पाटील,गाव मध्ये सांस्कृतिक कार्यक्रम आयोजित केला. सुमारे ५० लोकांनी सहभाग घेतला.
2024-01-20,लोकायत टीम,पुस्तक विक्री मोहीम,Campaign / Book Stall,मुंबई,सुनीता देशपांडे,"अनिल, रमेश",अनिता शर्मा,पुस्तक विक्री मोहिमेचे आयोजन केले. ३० पुस्तके विकली गेली.`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'activity-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-screen">
      <div className="upload-container">
        <h1 className="upload-title">CSV Presentation Generator</h1>
        <p className="upload-subtitle">Upload your activity CSV file to generate an interactive presentation</p>

        <button className="template-download-button" onClick={handleDownloadTemplate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Sample Template
        </button>

        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="dropzone-content">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <p className="dropzone-text">
              {dragActive ? 'Drop your CSV file here' : 'Drag and drop your CSV file here'}
            </p>
            <p className="dropzone-or">or</p>
            <button className="browse-button" onClick={handleBrowseClick}>
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        {selectedFile && !error && (
          <div className="file-info">
            <svg className="file-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
            </svg>
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}

        {selectedFile && !error && (
          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Generate Presentation'}
          </button>
        )}
      </div>
    </div>
  );
}
