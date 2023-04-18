import { useDispatch, useSelector } from 'react-redux';
import { VideoDetail, getVideoDetailList, selectVideoDetailList } from './index.model';
import React, { useEffect, useRef, useState } from 'react';


const VideoPreview: React.FC<{videoDetail :VideoDetail, videoUrl:string}> = ({videoDetail, videoUrl}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentSegment, setCurrentSegment] = useState(0);

  const segments = [
    { start: 10, end: 13 },
    { start: 30, end: 33 },
    { start: 50, end: 53 },
  ];
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current?.play();
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentSegment]);

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime >= segments[currentSegment].end) {
      if (currentSegment < segments.length - 1) {
        setCurrentSegment(currentSegment + 1);
        videoRef.current?.play();
      } else {
        video.pause();
      }
    }
  };
  const videoURL = `${videoUrl}getVideo?video_name=${videoDetail.name}`;
  const previewURL = `${videoURL}#t=${segments[currentSegment].start},${segments[currentSegment].end}`;


  return (
    <div>
      {videoURL && (
        <video
          ref={videoRef}
          width="320"
          height="240"
          controls
          autoPlay={true}
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
        >
          <source src={previewURL} type="video/mp4" />
          您的浏览器不支持 video 标签。
        </video>
      )}
    </div>
  );
}

// 展示播放视频列表,随机选取一帧画面做预览图
// 点击按钮跳转播放视频
export const VideoList: React.FC = () => {
  const dispatch = useDispatch();
  const videoDetailList = useSelector(selectVideoDetailList);

  React.useEffect(() => {
    dispatch(getVideoDetailList() as any);
  }, [dispatch]);

  return (
    <>
      <div>
        <h1>视频播放列表</h1>
        <div>
          {videoDetailList.videos.map((videoDetail) => (
            <div>
              {/* <a href={`${videoDetailList.videoUrl}toVideo?video_name=${videoDetail.name}`}>{videoDetail.name}</a> */}
              <VideoPreview videoDetail={videoDetail} videoUrl={videoDetailList.videoUrl}/>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
