import { RootState } from "../../store";
import { TranslationTexts, TranslationTextsGroup,TranslationText, sendTranslationTextType } from "./index.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// get TranslationTextsGroup from server
export const getTranslationTextsGroup = createAsyncThunk(
    "translation/getTranslationTextsGroup",
    async () => {
        const response = await fetch("http://localhost:9998/get_i18n");
        return (await response.json()) as TranslationTextsGroup;
    }
);


// send sendTranslationTextType to server
export const sendTranslationText = createAsyncThunk(
    "translation/sendTranslationText",
    async (translationText: sendTranslationTextType) => {
        const response = await fetch("http://localhost:9998/send_translation_text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(translationText),
        });
        return (await response.json()) as TranslationTextsGroup;
    }
);



// creat state 
export interface TranslationState {
    translationTextsGroup: TranslationTextsGroup;
    selectKey: string;
}

// Create a variable to store TranslationTexts
const initData: TranslationTexts = {
    "1": {
        textKey: "1",
        zhCN: "1",
        enUS: "1",
        zhTW: "1",
        comment:"1",
    },
    "2": {
        textKey: "2",
        zhCN: "2",
        enUS: "2",
        zhTW: "2",
        comment: "2",
    },
};


// store initData
// use createSlice Modify initData
export const translationSlice = createSlice({
    name: "translation",
    initialState: {
        translationTextsGroup: {
            "1": initData,
        },
        selectKey: "1",
    } as TranslationState,
    reducers: {
        init: (state,action) => {
            state.translationTextsGroup = action.payload;
        },
        addTranslation: (state, action) => {
            const { textKey } = action.payload;
            state.translationTextsGroup[state.selectKey][textKey] = action.payload;
        },
        updateTranslation: (state, action) => {
            const { textKey } = action.payload;
            state.translationTextsGroup[state.selectKey][textKey] = action.payload;
        },
        deleteTranslation: (state, action) => {
            const { textKey } = action.payload;
            delete state.translationTextsGroup[state.selectKey][textKey];
        },
        updateSelectKey: (state, action) => {
            state.selectKey = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTranslationTextsGroup.fulfilled, (state, action) => {
            state.translationTextsGroup = action.payload;
            state.selectKey = Object.keys(action.payload)[0];
            // 为 state.translationTextsGroup 成员赋值textKey
            for (const key in state.translationTextsGroup) {
                for (const textKey in state.translationTextsGroup[key]) {
                    state.translationTextsGroup[key][textKey].textKey = textKey;
                }
            }
        });
    },


});

// export action
export const { addTranslation, updateTranslation, deleteTranslation,
    updateSelectKey,
} = translationSlice.actions;

// export reducer
export default translationSlice.reducer;

// export selector
export const selectTranslationGroupKeys = (state: RootState) => Object.keys(state.translation.translationTextsGroup);
export const selectTranslationGroup = (state: RootState) => state.translation.translationTextsGroup;
export const selectSelectKey = (state: RootState) => state.translation.selectKey;
export const selectTranslation = (state: RootState) => state.translation.translationTextsGroup[state.translation.selectKey];

// Use List and Card to present the selectTranslation



