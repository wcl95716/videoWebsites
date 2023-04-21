
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// class VideoDetail:
//     def __init__(self, path):
//         self.name = os.path.basename(path)
//         self.path = path
//         self.byteSize = get_file_size(path)
//         self.sizeStr = convert_bytes_to_human_readable(self.byteSize)       
//     def __dict__(self):
//         return {
//             'name': self.name,
//             'path': self.path,
//             'byteSize': self.byteSize,
//             'sizeStr': self.sizeStr
//         }
// class VideoDetailList:
//     def __init__(self):
//         self.__videos = []
//         self.__videosMap={}
//     def __dict__(self):
//         return {
//             'videos': self.__videos,
//         }


// get state from http://127.0.0.1:5000/getVideosDetail
// use createSlice store videoDetailList
export const getVideoDetailList = createAsyncThunk(
    "video/getVideoDetailList",
    async () => {
        console.log("response 111 ")
        const response = await fetch("http://192.168.0.105:5000/getVideosDetail");
        console.log("response ",response)
        return (await response.json()) as VideoDetailList;
    }
);



export interface VideoDetail {
    name: string;
    path: string;
    byteSize: number;
    sizeStr: string;
}

export interface VideoDetailList {
    videos: VideoDetail[];
    videoUrl:string;
}

// creat state 
export interface VideoState {
    videoDetailList: VideoDetailList;
}

// Create a variable to store VideoDetailList
const initData: VideoDetailList = {
    videos: [],
    videoUrl: ""
};

// store initData
// use createSlice Modify initData
export const videoSlice = createSlice({
    name: "video",
    initialState: {
        videoDetailList: initData,
    } as VideoState,
    reducers: {
        init: (state, action) => {
            state.videoDetailList = action.payload;
        },
    },
    extraReducers:
    (builder) => {
        builder.addCase(getVideoDetailList.fulfilled, (state, action) => {
            state.videoDetailList = action.payload;
        });
    },
});

export const { init } = videoSlice.actions;

export default videoSlice.reducer;

// selector 
export const selectVideoDetailList = (state: RootState) => state.video.videoDetailList;

// Path: src\componens\video\index.tsx
