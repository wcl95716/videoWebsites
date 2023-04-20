

import os
import random
import time
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

def get_frame_list(video_path,segment_duration=2,count = 6):
    start_time = time.time()
    cap = cv2.VideoCapture(video_path)
    end_time = time.time()
    # 获取视频的总帧数和帧速率
    num_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # 计算每个片段的帧数
    segment_length = segment_duration * fps

    # print("总帧数：", num_frames)
    # print("帧速率：", fps)
    # print("每个片段的帧数：", segment_length)
    
    # 随机选择多个时间戳
    timestamp_list = get_timestamp_list(num_frames, segment_length,count)
  
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) 
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    frame_list = []
    for timestamp in timestamp_list:
        # 跳过一些帧，以便在指定的时间戳处开始读取视频帧
        cap.set(cv2.CAP_PROP_POS_FRAMES, timestamp)
        for i in range(segment_length):
            ret, frame = cap.read()
            if not ret:
                break
            #frame = cv2.resize(frame, (width, height))
            frame_list.append(frame)
    cap.release()
    print("get_frame_list: time", end_time - start_time, "秒",video_path)
    return frame_list, width, height, fps

def output_video(video_path, frame_list, fps, width, height):
    start_time = time.time()
    # 保存视频
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video_writer = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    for frame in frame_list:
        frame = cv2.resize(frame, (width, height))
        video_writer.write(frame)
    video_writer.release()
    end_time = time.time()
    print("output_video time: ", end_time - start_time, "秒",video_path)

    
class VideoPreview:
    __file_path = ""
    __video_name = ""
    __out_video_path = ""
    __width = 0
    __height = 0
    __fps  = 0

    def __init__(self,video_path) -> None:
        self.__video_path = video_path
        self.__file_path = os.path.dirname(video_path)
        self.__video_name = os.path.basename(video_path)
        self.__out_video_path = self.__file_path + "/preview_" + self.__video_name
        pass

    @classmethod # 类方法 用于创建对象
    def init(cls, path):
        return cls(path)
    
    def preprocessing_video(self):
        frame_list, width, height, fps =get_frame_list(self.__video_path)
        self.__frames_list = frame_list
        self.__width = width
        self.__height = height
        self.__fps = fps
        pass

    def get_frames(self):
        return self.__frames_list
    def get_width(self):
        return self.__width
    def get_height(self):
        return self.__height
    def get_fps(self):
        return self.__fps

    # 方法执行时间比较长 所以需要新建一个进程进行执行
    def write_video(self,minification=4):
        # 保存视频
        # print("write_video 1 ",self.__out_video_path, self.__width, self.__height)
        # print("write_video 2",self.__out_video_path, self.__width//minification, self.__height//minification)
        output_video(self.__out_video_path, 
                    self.__frames_list, 
                    self.__fps, 
                    self.__width//minification, 
                    self.__height//minification)
        #del self.__frames_list

        pass



if __name__ == '__main__':
    path = r"D:\videos\2493d5579f6ca9ee667d57bbde534217.mp4"
    # frame_list, width, height, fps = get_frame_list(path)
    # output_video("preview.mp4", frame_list, fps, width, height)
    test_VideoPreview = VideoPreview.init(path)
    test_VideoPreview.preprocessing_video()
    test_VideoPreview.write_video()

    # file_path = '/path/to/file.txt'
    # dir_path = os.path.dirname(file_path)
    # print("文件路径：", file_path)
    # print("路径部分：", dir_path)


