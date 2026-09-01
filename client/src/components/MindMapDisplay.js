import React, { useEffect } from 'react';
import mermaid from 'mermaid';
import './MindMapDisplay.css';

function MindMapDisplay({ data, fileName, onReset }) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  const downloadMermaid = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.mermaidDiagram));
    element.setAttribute('download', `mindmap-${Date.now()}.mmd`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadSVG = async () => {
    try {
      const svg = document.querySelector('.mermaid svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `mindmap-${Date.now()}.png`;
          link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    } catch (err) {
      console.error('Error downloading SVG:', err);
    }
  };

  return (
    <div className="mindmap-display">
      <div className="mindmap-header">
        <div>
          <h2>Mind Map: {fileName}</h2>
          <p>{data.keyPoints.length} key points extracted</p>
        </div>
        <div className="button-group">
          <button onClick={downloadMermaid} className="btn btn-primary">
            📥 Download Mermaid
          </button>
          <button onClick={downloadSVG} className="btn btn-secondary">
            🖼️ Download Image
          </button>
          <button onClick={onReset} className="btn btn-reset">
            ↺ Upload New PDF
          </button>
        </div>
      </div>

      <div className="mindmap-container">
        <div className="mermaid">
          {data.mermaidDiagram}
        </div>
      </div>

      <div className="key-points-section">
        <h3>📌 Extracted Key Points</h3>
        <div className="key-points-list">
          {data.keyPoints.map((point, idx) => (
            <div key={idx} className="key-point-item">
              <h4>{point.title}</h4>
              {point.description && <p>{point.description}</p>}
              {point.children && point.children.length > 0 && (
                <ul>
                  {point.children.map((child, childIdx) => (
                    <li key={childIdx}>{child.title}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MindMapDisplay;
