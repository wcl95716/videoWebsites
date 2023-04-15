from flask import Flask, send_file, send_from_directory
import os
app = Flask(__name__)

@app.route("/")
def index():
    return """
        <h1>Video Streaming Demonstration</h1>
        <video src="/videos" width="800" height="600" controls></video>
        """


import ffmpeg

def convert_video(input_file, output_file):
    (
        ffmpeg
        .input(input_file)
        .output(output_file)
        .run()
    )
         
@app.route('/videos')
def download_file():
    # videos_dir = './videos/n0837_machiko_ono_ub_n_fhd.wmv'  # 视频文件存储路径
    videos_dir_mp4 = './videos/1.mp4'  # 视频文件存储路径
    vi2 = r'G:\lsp\2019年最新三上悠亜合集25部【中文字幕纯净完整版】\(MIDE-599)中文字幕纯净版.(三上悠亜)【エスワン専属×ムーディーズ人気シリーズ】 早漏イクイク敏感4SEX.mp4'
    # convert_video(videos_dir, videos_dir_mp4)
    # return send_from_directory("./", videos_dir_mp4)
    return send_file(vi2,  mimetype='video/mp4', as_attachment=True)
    #return app.response_class(generate(videos_dir), mimetype='video/mp4')
if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5000,debug=True)
    #app.run(host='192.168.0.113',port=5000,debug=True)