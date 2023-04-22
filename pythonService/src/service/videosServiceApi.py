

import json
import logging
import multiprocessing
import threading
import time
import cv2
from flask import Flask, request, send_file, send_from_directory
from flask_cors import CORS
import os
import sys

sys.path.append('../tools/')
import videoPreview

import ev

app = Flask(__name__)
CORS(app) # 解决跨域问题
app.logger.setLevel(logging.DEBUG)

@app.route('/getVideosDetail')
def videosDetail():
    #print("#################### ")
    videoDetailList.videoUrl = request.host_url
    return json.dumps(videoDetailList.__dict__(),ensure_ascii=False)
    pass
    
# 创建api 用于获取视频文件 传入参数为视频文件名
# example: http://localhost:5000/getVideo?video_name=1.mp4
@app.route('/getVideo', methods=['GET'])
def getVideo():
    video_name = request.args.get('video_name')
    video:ev.VideoDetail = videoDetailList.get_video(video_name)
    
    if video is None:
        # video_preview_path = videoPreview.get_video_preview_path(video.path)
        # os.remove(video.path)
        # os.remove(video_preview_path)
        videoDetailList.delete_video(video_name)
    print("video.path ",video.path)
    return send_file(video.path,  mimetype='video/mp4', as_attachment=True)
    pass


def do_make(video_path:str):
    start_time = time.time()
    videoPreview.output_video_preview(video_path)
    print("do_make end ",time.time() -start_time,video_path)
    pass

def make_video_preview(video_path:str):
    video = ev.VideoDetail( videoPreview.get_video_preview_path(video_path))
    videoDetailPreviewList.add_video(video)
    print("make_video_preview",video_path)
    pool_multiprocessing.apply_async(do_make, (video_path,))

    pass 

# getVideoPreview
@app.route('/getVideoPreview', methods=['GET'])
def getVideoPreview():
    video_name = request.args.get('video_name')
    # print("getVideoPreview video_name",video_name)
    video:ev.VideoDetail = videoDetailList.get_video(video_name.replace("%26","&"))
    if video is None:
        print("################################################video is None",video_name)
    video_preview_path = videoPreview.get_video_preview_path(video.path)
    # 判断这个文件是否存在
    if os.path.exists(video_preview_path) or videoDetailPreviewList.get_video(video_name) is not None:
        #print("文件存在:",video_preview_path)
        return send_file(video_preview_path,  mimetype='video/mp4', as_attachment=False)
    else:
        #print("文件不存在")
        make_video_preview(video.path)
        return "文件不存在"

@app.route("/toVideo")
def toVideo():
    video_name = request.args.get('video_name')
    print(video_name)
    video:ev.VideoDetail = videoDetailList.get_video(video_name)
    #print("video.path ",video.path)
    
    return f"""
        <h1>{video_name}</h1>
        <video src="getVideo?video_name={video_name}" width="800" height="600" controls></video>
        // 删除按钮
        <button style="width: 300px;height: 300px; background-color: grey;"
        onclick="deleteVideo()">删除</button>
        <script>
            function deleteVideo() {{
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "deleteVideo?video_name={video_name}", true);
                xhr.onreadystatechange = function() {{
                    if (xhr.readyState == 4) {{
                        if (xhr.status == 200) {{
                            console.log(xhr.responseText);
                            alert("删除成功");
                            window.location.href = "http://192.168.0.105:5000/"
                        }} else {{
                            alert("删除失败");
                        }}
                    }}
                }}
                xhr.send();
            }}
        </script>
        """

def do_delete(video_path:str):
    
    # 判断是否删除失败
    count  = 10
    while count > 1:
        bl =  os.remove(video_path)
        print("do_delete",bl,count , video_path)
        count -= 1
        if bl:
            break
        # 休眠一秒
        time.sleep(10)
    pass
# 添加一个删除功能
@app.route('/deleteVideo', methods=['GET'])
def deleteVideo():
    video_name = request.args.get('video_name')
    print(video_name)
    video:ev.VideoDetail = videoDetailList.get_video(video_name)
    if video is None :
        return "deleteVideo OK video is None"
    print("video.path ",video.path)
    video_preview_path = videoPreview.get_video_preview_path(video.path)
    # 另一个程序正在使用此文件，进程无法访问。: 'G:Trashes\\501\\欧美VR\\VR电影 (9).mp4'
    # 不能删除正在使用的文件
    # 线程内执行删除操作
    threading.Thread(target=do_delete, args=(video,video_preview_path)).start()
    
    videoDetailList.delete_video(video_name)

    print("deleteVideo OK")
    return "deleteVideo OK"


if __name__ == '__main__':
    videos,videos_preview = ev.getVideoDetailList()
    videoDetailList:ev.VideoDetailList =videos
    videoDetailPreviewList:ev.VideoDetailList = videos_preview
    pool_multiprocessing = multiprocessing.Pool(4, maxtasksperchild=10)
    app.run(host='0.0.0.0',port=5000,debug=False)
    #app.run(host='192.168.0.108',port=5000,debug=False)