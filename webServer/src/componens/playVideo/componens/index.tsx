import React, { useState, useEffect } from 'react';
import { VideoDetail } from '../index.model';
import "./index.css"

export const VideoPreviewItem: React.FC<{ videoDetail: VideoDetail, videoUrl: string }> = ({ videoDetail, videoUrl }) => {

  // 只有前端点击一下的时候才播放 
  // 播放的时候点击第二下可以触发外部包裹的a标签跳转
  const [isPlay, setIsPlay] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);


  // 点击VideoPreviewItem 不触发a标签跳转
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('click', (event) => {
        if (!isPlay) {
          event.stopPropagation();
        }

      });
    }
  }, []);
  useEffect(() => {
    if (isPlay) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlay]);

  // 鼠标在video上面的时候播放视频
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('mouseenter', (event) => {
        event.stopPropagation();
        setIsPlay(true);
      });
      video.addEventListener('mouseleave', () => {
        setIsPlay(false);
      });
    }
  }, []);
  // 手机端也支持
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('touchstart', (event) => {
        event.stopPropagation();
        setIsPlay(true);

      });
      video.addEventListener('touchend', () => {
        //setIsPlay(false);
      });
    }
  }, []);

  const previewUrl = `${videoUrl}getVideoPreview?video_name=${videoDetail.name}`;
  // 如果previewUrl 没有响应 三秒后再次访问
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const video = videoRef.current;
  //     if (video) {
  //       video.src = previewUrl;
  //     }
  //   }, 3000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [previewUrl]);


  return (
    <>
      <div style={{
        // 居中
        position: "relative",
        height: "auto",
      }}
        aria-disabled
        className="video-preview-item" onClick={() => setIsPlay(!isPlay)}
      >
          <video
            ref={videoRef}
            className="video-preview-item-video"
            src={`${videoUrl}getVideoPreview?video_name=${videoDetail.name.replace('&', '%26').replace('%26', '%2526')}`}
            //controls
            autoPlay
            muted
            loop
            width="320" height="240"
            playsInline
          />
      </div>

    </>
  );
};

//   return (
//     <>
//       <div className="video-preview-item">
//         <video
//           className="video-preview-item-video"
//           src={`${videoUrl}getVideoPreview?video_name=${videoDetail.name}`}
//           controls
//           autoPlay
//           muted
//           loop
//           width="320" height="240"
//         />
//         <div className="video-preview-item-title">{videoDetail.name}</div>
//       </div>
//     </>
//   );
// };
