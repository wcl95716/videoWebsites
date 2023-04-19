import React, { useState, useEffect } from 'react';
import { VideoDetail } from '../index.model';
import "./index.css"
const VideoPreviewImg : React.FC<{videoDetail :VideoDetail, videoUrl:string}> = ({videoDetail, videoUrl}) => {
  const url = `${videoUrl}toVideoPreview?video_name=${videoDetail.name}`
  return (
    <div>
        <img className="image-container" src={url} 
         alt="Video Preview" 
        />
    </div>
    
  );
};

export default VideoPreviewImg;
