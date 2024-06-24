import { createAction, createReducer } from "@reduxjs/toolkit";

export interface Attendify {
  captureVideo?: boolean;
  videoRef?: any
}

export interface AttendifyState {
    attendify?: Attendify
}

const initialState: AttendifyState = {
  attendify: { captureVideo: false }
};

export const setAttendify = createAction<Attendify | undefined>("setAttendify");

const attendifyReducer = createReducer(initialState, (builder) =>
  builder.addCase(setAttendify, (state, action) => {
    state.attendify = action.payload;
  })
);

export default attendifyReducer;
