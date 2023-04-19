

import random
import cv2
from cv2 import Mat


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

class VideoPreview:
    def __init__(self,frame_list: list[Mat] , width:int , height:int , fps:int) -> None:
        self.__frames_list = frame_list
        self.__width = width
        self.__height = height
        self.__fps  = fps
        pass
    def get_frames(self):
        return self.__frames_list
    def get_width(self):
        return self.__width
    def get_height(self):
        return self.__height
    def get_fps(self):
        return self.__fps
    

def get_frame_list(video_path,segment_duration=3,count = 6):
    cap = cv2.VideoCapture(video_path)

    # 获取视频的总帧数和帧速率
    num_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # 计算每个片段的帧数
    segment_length = segment_duration * fps

    print("总帧数：", num_frames)
    print("帧速率：", fps)
    print("每个片段的帧数：", segment_length)

    # 随机选择多个时间戳
    timestamp_list = get_timestamp_list(num_frames, segment_length,count)
  
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))//2
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))//2

    frame_list = []
    for timestamp in timestamp_list:
        # 跳过一些帧，以便在指定的时间戳处开始读取视频帧
        cap.set(cv2.CAP_PROP_POS_FRAMES, timestamp)
        for i in range(segment_length):
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.resize(frame, (width, height))
            frame_list.append(frame)

    cap.release()
    return VideoPreview(frame_list,width,height,fps)




def video_preview_stream(frame_list:VideoPreview):
    while True:
        for frame in frame_list.get_frames():
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

if __name__ == '__main__':
    path = r"D:\videos\3868710446aa1b7bb60d3e5e71c8ca5f.mp4"
    get_frame_list(path)


