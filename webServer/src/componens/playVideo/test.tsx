import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VideoDetail, getVideoDetailList, selectVideoDetailList } from './index.model';

// VideoPlay 播放单个视频 
// 参数为 { videoDetail :VideoDetail, videoUrl:videoUrl}
export const VideoPlay: React.FC<{videoDetail :VideoDetail, videoUrl:string}> = ({videoDetail, videoUrl}) => {
  return (
    <>
      <div>
        <video controls src={`${videoUrl}getVideo?video_name=${videoDetail.name}`}/>
      </div>
    </>
  );
};

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
              <a href={`${videoDetailList.videoUrl}toVideo?video_name=${videoDetail.name}`}>{videoDetail.name}</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
