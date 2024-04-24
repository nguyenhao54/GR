import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.reducer";
import dialogReducer from "./dialog.reducer";
import topLoadingReducer from './toploading.reducer';

export const store = configureStore({
  reducer: {
    // Ten thuoc tinh duoi day de dat ten cho state store name
    user: userReducer,
    dialog: dialogReducer,
    topLoading: topLoadingReducer,
    // taskFilter: taskReducer
  },
});

// Lấy RootState và AppDispatch từ store phuc vu cho TS
export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
