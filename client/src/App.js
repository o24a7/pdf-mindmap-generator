import React, { useState } from 'react';
import axios from 'axios';
import MindMapDisplay from './components/MindMapDisplay';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  const [mindmapData, setMindmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setMindmapData(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFileName(response.data.fileName);
      setMindmapData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing PDF. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>📊 PDF Mind Map Generator</h1>
        <p>Extract key points and visualize your PDF documents as interactive mind maps</p>
      </header>

      <main className="main-content">
        <div className="container">
          {!mindmapData && <FileUpload onFileUpload={handleFileUpload} loading={loading} />}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing your PDF...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {mindmapData && (
            <MindMapDisplay
              data={mindmapData}
              fileName={fileName}
              onReset={() => {
                setMindmapData(null);
                setFileName('');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
