import { createAction, createReducer } from "@reduxjs/toolkit";
import { User } from "../models";

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const setCurrentUser = createAction<User | null>("setUser");

const userReducer = createReducer(initialState, (builder) =>
  builder.addCase(setCurrentUser, (state, action) => {
    state.user = action.payload;
  })
);

export default userReducer;
