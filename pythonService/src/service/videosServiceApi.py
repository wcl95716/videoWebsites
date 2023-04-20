

import json
import logging
import time
import cv2
from flask import Flask, request, send_file, send_from_directory
from flask_cors import CORS
import os
import sys
sys.path.append('../tools/')

from videoPreview import VideoPreview, get_frame_list


import ev
# No module named 'ev'





# No module named 'pythonService'

app = Flask(__name__)
CORS(app) # 解决跨域问题
app.logger.setLevel(logging.DEBUG)



@app.route('/getVideosDetail')
def videosDetail():
    videoDetailList:ev.VideoDetailList = ev.getVideoDetailList()
    #print("#################### ")
    videoDetailList.videoUrl = request.host_url
    
    return json.dumps(videoDetailList.__dict__(),ensure_ascii=False)
    pass
    
# 创建api 用于获取视频文件 传入参数为视频文件名
# example: http://localhost:5000/getVideo?video_name=1.mp4
@app.route('/getVideo', methods=['GET'])
def getVideo():
    video_name = request.args.get('video_name')
    print(video_name)
    videoDetailList:ev.VideoDetailList = ev.getVideoDetailList()
    video:ev.VideoDetail = videoDetailList.get_video(video_name)
    print("video.path ",video.path)
    # return send_file(video.path, attachment_filename=video.name, as_attachment=True)
    #return send_from_directory(video.path, video.name, as_attachment=True)
    return send_file(video.path,  mimetype='video/mp4', as_attachment=True)
    pass

@app.route("/toVideo")
def toVideo():
    video_name = request.args.get('video_name')
    print(video_name)
    videoDetailList:ev.VideoDetailList = ev.getVideoDetailList()
    video:ev.VideoDetail = videoDetailList.get_video(video_name)
    print("video.path ",video.path)
    
    return f"""
        <h1>Video Streaming Demonstration</h1>
        <video src="getVideo?video_name={video_name}" width="800" height="600" controls></video>
        """




if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5000,debug=True)
    #app.run(host='192.168.0.108',port=5000,debug=False)