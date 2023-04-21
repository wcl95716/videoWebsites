import { useDispatch, useSelector } from 'react-redux';
import { VideoDetail, getVideoDetailList, selectVideoDetailList } from './index.model';
import React, { useEffect, useRef, useState } from 'react';
import { Pagination } from 'antd';
import { VideoPreviewItem } from './componens';


// 展示播放视频列表,随机选取一帧画面做预览图
// 点击按钮跳转播放视频
export const VideoList: React.FC = () => {
  const dispatch = useDispatch();
  const videoDetailList = useSelector(selectVideoDetailList);

  React.useEffect(() => {
    dispatch(getVideoDetailList() as any);
    
  }, [dispatch]);

  // 添加翻页功能
  const pageStorage = localStorage.getItem('page');
  const pageSizeStorage = localStorage.getItem('pageSize');

  const [page, setPage] = useState(pageStorage ? parseInt(pageStorage) : 1);
  const [pageSize, setPageSize] = useState(pageSizeStorage ? parseInt(pageSizeStorage) : 10);
  const [total, setTotal] = useState(0);
  const [videoList, setVideoList] = useState<VideoDetail[]>([]);

  const videoListRef = useRef(videoList);

  useEffect(() => {
    videoListRef.current = videoList;
  }, [videoList]);

  useEffect(() => {
    const videoList = videoDetailList.videos.slice((page - 1) * pageSize, page * pageSize);
    setVideoList(videoList);
    setTotal(videoDetailList.videos.length);
  }, [page, pageSize, videoDetailList.videos]);

  const pageChange = (page: number, pageSize?: number) => {
    setPage(page);
    setPageSize(pageSize || 10);
  };

  const pagination = {
    current: page,
    pageSize: pageSize,
    total: total,
    onChange: pageChange,
    showSizeChanger: true,
    onShowSizeChange: (current:number , size:number) => {
      setPage(current);
      setPageSize(size);
    },
  };

  // 刷新页面的时候保留当前页
  useEffect(() => {
    const page = localStorage.getItem('page');
    const pageSize = localStorage.getItem('pageSize');
    if (page && pageSize) {
      setPage(parseInt(page));
      setPageSize(parseInt(pageSize));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('page', page.toString());
    localStorage.setItem('pageSize', pageSize.toString());
  }, [page, pageSize]);


  return (
    <>
      <div>
        <h1>视频播放列表</h1>
        <Pagination {...pagination} />
        <div>
          {videoList.map((videoDetail) => (
            <div style={{  height: "auto", }}>
              <a
              // 点击打开新页面
                target="_blank" 
                // 文件名中包含&符号的时候会导致url解析错误
                // 解决方法：将&符号转换为%26
                // 但是这个方法有缺陷，如果文件名中包含%26，那么就会被转义成&符号
                // 所以这里需要先将%26转义成%2526
                href={`${videoDetailList.videoUrl}toVideo?video_name=${videoDetail.name.replace('&', '%26').replace('%26', '%2526')}`}
                // href={`${videoDetailList.videoUrl}toVideo?video_name=${videoDetail.name}`}
                //href={`${videoDetailList.videoUrl}toVideo?video_name=${(videoDetail.name)}`}
                >
                <div  >
                  <VideoPreviewItem videoDetail={videoDetail} videoUrl={videoDetailList.videoUrl} />
                </div>
                 {videoDetail.name} 
              </a>
            </div>
          ))}
        </div>
        <div>
          <br />
          <br />
          <br />
        </div>
        <Pagination {...pagination} />
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

//   return (
//     <>
//       <div>
//         <h1>视频播放列表</h1>
//         <div>
//           {videoDetailList.videos.map((videoDetail) => (
//             <div>
//               <a href={`${videoDetailList.videoUrl}toVideo?video_name=${videoDetail.name}`}>
//                 <video width="320" height="240" controls>
//                   <source src={`${videoDetailList.videoUrl}getVideoPreview?video_name=${videoDetail.name}`} type="video/mp4" />
//                 </video>
//                 {videoDetail.name}
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };
