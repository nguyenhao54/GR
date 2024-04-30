import { createAction, createReducer } from "@reduxjs/toolkit";

export interface Toploading {
    show?: boolean
}

export interface TopLoadingState {
    topLoading?: Toploading
}

const initialState: TopLoadingState = {
    topLoading: undefined
};

export const showTopLoading = createAction("showTopLoading");
export const closeTopLoading = createAction("closeTopLoading");

const topLoadingReducer = createReducer(initialState, (builder) =>
    builder
        .addCase(showTopLoading, (state) => {
            state.topLoading = { show: true };
        })
        .addCase(closeTopLoading, (state) => {
            state.topLoading = { show: false };
        })
);

export default topLoadingReducer;
