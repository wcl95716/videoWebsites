import React, { useState } from 'react';
import './video-preview.css';

export function VideoPreview() {
    const [showPreview, setShowPreview] = useState(false);
  
    function handleMouseEnter() {
      setShowPreview(true);
    }
  
    function handleMouseLeave() {
      setShowPreview(false);
    }
  
    return (
      <div className="video-preview">
        <div className="progress-bar" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="progress" style={{ width: '50%' }}></div>
        </div>
        {showPreview && (
          <div className="preview-window">
            <video src="http://127.0.0.1:5000/videos" autoPlay muted loop />
          </div>
        )}
      </div>
    );
  }
  