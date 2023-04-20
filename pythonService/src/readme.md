



``` py
# 这个方法是将图片按照视频帧的分割方法流传输
# 但是实际效果并不好
def video_preview_stream(frame_list:VideoPreview):
    while True:
        for frame in frame_list.get_frames():
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            time.sleep(1.0/frame_list.get_fps())
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
```


``` py
def get_timestamp_list( num_frames , segment_length, count = 5 ):
    timestamp_list = []
    # 生成时间戳列表 以便在指定的时间戳处开始读取视频帧
    # 从0开始，随机生成count个时间戳 
    # 间隔至少为segment_length
    for i in range(count):
        timestamp = random.randint(0, num_frames-segment_length-1)
        timestamp_list.append(timestamp)
    timestamp_list.sort()
    return timestamp_list

def select_random_video_segment(video_path, segment_duration=5):
    cap = cv2.VideoCapture(video_path)

    # 获取视频的总帧数和帧速率
    num_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # 计算每个片段的帧数
    segment_length = segment_duration * fps

    print("总帧数：", num_frames)
    print("帧速率：", fps)
    print("每个片段的帧数：", segment_length)

    # 随机选择一个时间戳
    #timestamp = random.randint(0, num_frames-segment_length-1)
    timestamp_list = get_timestamp_list(num_frames, segment_length,count=1)
  
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))//4
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))//4
    # 读取指定时间戳处的片段，并将其保存到新的视频文件中
    out = cv2.VideoWriter('segment2.mp4',
                            cv2.VideoWriter_fourcc(*'mp4v'),
                            fps,
                            (
                                int(width), 
                                int(height)
                            ),
                             )

    ## 这个地方效率太低 , 所以这里的东西建议预处理
    for timestamp in timestamp_list:
    # 跳过一些帧，以便在指定的时间戳处开始读取视频帧
        cap.set(cv2.CAP_PROP_POS_FRAMES, timestamp)
        for i in range(segment_length):
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.resize(frame, (width, height))
            out.write(frame)
        
    out.release()
    cap.release()

```