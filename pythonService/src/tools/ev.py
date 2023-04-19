import json
import os
from typing import List, Tuple

# import sys
# sys.path.append("other_folder")

def convert_to_bytes(size_str: str) -> int:
    size_str = size_str.strip().lower()  # 移除空格并转换为小写
    unit = size_str[-1]  # 获取单位（最后一个字符）

    if not size_str[:-1].isdigit():  # 检查除单位外的其他字符是否均为数字
        raise ValueError(f"Invalid size string: {size_str}")

    size = int(size_str[:-1])  # 获取数值部分

    if unit == "b":
        return size
    elif unit == "k":
        return size * 1024
    elif unit == "m":
        return size * 1024 ** 2
    elif unit == "g":
        return size * 1024 ** 3
    elif unit == "t":
        return size * 1024 ** 4
    else:
        raise ValueError(f"Invalid unit: {unit}")
    
def convert_bytes_to_human_readable(size_in_bytes):
    if size_in_bytes is None:
        return "N/A"
    
    size_labels = ["Bytes", "KB", "MB", "GB", "TB"]
    index = 0
    
    while size_in_bytes >= 1024 and index < len(size_labels) - 1:
        size_in_bytes /= 1024
        index += 1

    return f"{size_in_bytes:.2f} {size_labels[index]}"


def get_file_size(file_path):
    try:
        size = os.path.getsize(file_path)
        return size
    except OSError as e:
        print(f"Error: {e}")
        return None
    





class VideoDetail:
    def __init__(self, path):
        self.name = os.path.basename(path)
        self.path = path
        self.byteSize = get_file_size(path)
        self.sizeStr = convert_bytes_to_human_readable(self.byteSize)
        
    def __dict__(self):
        return {
            'name': self.name,
            'path': self.path,
            'byteSize': self.byteSize,
            'sizeStr': self.sizeStr,
            # 'url': self.url
        }


class VideoDetailList:
    def __init__(self):
        self.__videos = []
        self.__videosMap={}
        self.videoUrl = ""
        
    def __dict__(self):
        videos  = []
        for video in self.__videos:
            videos.append(video.__dict__())
        return {
            'videos': videos,
            'videoUrl': self.videoUrl,
        }
        
    def add_video_path(self, path):
        self.__videos.append(VideoDetail(path))
        
    def add_video(self, video:VideoDetail):
        self.__videos.append(video)
        self.__videosMap[video.name] = video
        
    def get_videos(self):
        return self.__videos
    
    def get_video(self,video_name:str):
        return self.__videosMap[video_name]
        pass
    

    pass
    
def scan():
    file_db = []
    print("正在初始化...")
    for url in ( r"D:\videos", "G:\\"):     # 如果有更多磁盘，可以继续添加
        for root, dirs, files in os.walk(url):
            print(files)
            for file in files:
                # 将文件名添加到列表中
                file_db.append(
                     os.path.join(root, file) # 将路径和文件名合并
                               ) 
    #os.system("cls")
    return file_db
def getVideoDetailList() -> VideoDetailList :
    file_db = scan()
    videos = VideoDetailList()
    filename = ".mp4" #input("请输入要搜索的文件名：")
    for file in file_db:
        #print("asdasd " , os.path.splitext(file)[1])
        if filename.lower() in os.path.splitext(file)[1].lower():
            video = VideoDetail(file)
            if video.byteSize > convert_to_bytes("1m"):
                videos.add_video(video)
    return videos

if __name__ == '__main__':
    getVideoDetailList()
    print( convert_to_bytes("100M") )
    
    
    
