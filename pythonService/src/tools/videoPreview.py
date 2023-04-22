

import os
import random
import time
import cv2
from cv2 import Mat


def get_timestamp_list( num_frames , segment_length, count = 5 ):
    timestamp_list = []
    # 生成时间戳列表 以便在指定的时间戳处开始读取视频帧
    # 从0开始，随机生成count个时间戳 
    step_len = (num_frames-segment_length)//count
    begin = 0
    for i in range(count):
        timestamp = random.randint(begin, begin+step_len -1 )
        begin += step_len
        timestamp_list.append(timestamp)
        #print("timestamp",timestamp)
    timestamp_list.sort()
    #print(timestamp_list)
    return timestamp_list

def get_video_preview_path(video_path):
    file_path = os.path.dirname(video_path)
    video_name = os.path.basename(video_path)
    out_video_path = file_path + "/preview_" + video_name
    return out_video_path

def get_frame_list(video_path,segment_duration=1,count = 20)  :
    cap = cv2.VideoCapture(video_path)
    # 获取视频的总帧数和帧速率
    num_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    # fps 为帧速率
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    # 计算每个片段的帧数
    segment_length = segment_duration * fps
    print("get_frame_list 1 ",fps, num_frames, segment_length)

    # 随机选择多个时间戳
    timestamp_list = get_timestamp_list(num_frames, segment_length,count)
  
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) 
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    yield width,height,fps
    
    for timestamp in timestamp_list:
        # 跳过一些帧，以便在指定的时间戳处开始读取视频帧
        cap.set(cv2.CAP_PROP_POS_FRAMES, timestamp)
        for i in range(segment_length):
            ret, frame = cap.read()
            if not ret:
                cap.release()
                return 
            yield frame
    cap.release()
  
def get_out_dimension(width,height,width_max =320):
    minification = 1
    while width//minification > width_max:
        minification = minification + 1
    out_width = width//minification
    out_height = height//minification
    return out_width,out_height

def output_video_preview(video_path,width_max =320,skip_rate = 1,segment_duration=1,count = 20):
    start_time = time.time()
    # 保存视频
    video_preview_frame = get_frame_list(video_path,segment_duration,count)
    width,height,fps =  video_preview_frame.__next__()
    print("output_video_preview 1 ",fps, width, height)
    out_width,out_height = get_out_dimension(width,height,width_max)
    print("output_video_preview 1 ",fps, out_width, out_height)
    
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    video_writer = cv2.VideoWriter(get_video_preview_path(video_path), fourcc, fps, (out_width, out_height))
    skip_tag = 0
    for frame in video_preview_frame:
        skip_tag += 1
        #print(frame)
        if skip_tag % skip_rate != 0:
            continue
        frame = cv2.resize(frame, (out_width, out_height))
        video_writer.write(frame)
    video_writer.release()
    end_time = time.time()
    print("output_video time: ", end_time - start_time, "秒",video_path)

 





if __name__ == '__main__':
    path = r"F:"
    # frame_list, width, height, fps = get_frame_list(path)
    # output_video("preview.mp4", frame_list, fps, width, height)
    output_video_preview(path)
    #print(  "preview".startswith("preview") )

    # file_path = '/path/to/file.txt'
    # dir_path = os.path.dirname(file_path)
    # print("文件路径：", file_path)
    # print("路径部分：", dir_path)


