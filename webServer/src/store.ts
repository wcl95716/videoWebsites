// use configureStore to create a store

import { configureStore } from "@reduxjs/toolkit";
import { translationSlice } from "./componens/modifyJson/index.model";
import { pasteboardSlice } from "./componens/pasteboard/index.model";

export const store = configureStore({
    reducer: {
        translation: translationSlice.reducer,
        pasteboard: pasteboardSlice.reducer,
    }
});

// RootState is the type of the root state
export type RootState = ReturnType<typeof store.getState>;
