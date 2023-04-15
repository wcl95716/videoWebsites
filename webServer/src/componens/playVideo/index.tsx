import "./styles.css";
import React, { useRef, useEffect } from 'react';

const PreviewVideo: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if(!canvas || !video  ) return;
    const context = canvas.getContext('2d');
    if (! context) return ;
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const img = new Image();
      img.src = `${src}#t=${currentTime}`;
      img.addEventListener('load', () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [src]);

  return (
    <div style={{ position: 'relative' }}>
      <video ref={videoRef} src={src} controls  width="390" height="390" />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};


// http://192.168.0.113:5000/videos
// http://127.0.0.1:5000/videos
export default function VideoPlayer() {
  return (
    <div>
      <video controls width="390" height="390" >
        <source src="http://192.168.0.113:5000/videos" type="video/mp4" />
      </video>
      {/* <PreviewVideo  src="http://192.168.0.113:5000/videos"   /> */}
    </div>
  );
}

