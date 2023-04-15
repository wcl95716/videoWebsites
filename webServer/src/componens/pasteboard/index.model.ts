import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// url=http://localhost:9998/get_text_list get pasteboardTexts
export const getPasteboardTexts = createAsyncThunk(
    "pasteboard/getPasteboardTexts",    
    async () => {
        const response = await fetch("http://localhost:9998/get_text_list");
        return (await response.json()) as PasteboardTexts;
    }
);



export interface PasteboardTexts {
    texts: string[];
}

// creat state
export interface PasteboardState {
    pasteboardTexts: PasteboardTexts;
}

// use createSlice store pasteboardTexts
export const pasteboardSlice = createSlice({
    name: "pasteboard",
    initialState: {
        pasteboardTexts: {
            texts: [],
        },
    } as PasteboardState,
    reducers: {
        init: (state, action) => {
            state.pasteboardTexts = action.payload; // action.payload is pasteboardTexts
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPasteboardTexts.fulfilled, (state, action) => {
            state.pasteboardTexts = action.payload;
        });

    },
});

export const { init } = pasteboardSlice.actions;

export default pasteboardSlice.reducer;

// Path: src\componens\pasteboard\index.tsx


