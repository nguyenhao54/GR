import { createAction, createReducer } from "@reduxjs/toolkit";
// import { User } from "../models";


export interface DialogState {

    title?: string;
    content?: JSX.Element;
    onClickOk?: () => void;
    open?: boolean;
}

const initialState: DialogState = {
title: undefined,
content: undefined,
onClickOk: undefined,
open: false

};

export const setDialog= createAction<any | null>("setDialog");

const userReducer = createReducer(initialState, (builder) =>
  builder.addCase(setDialog, (dialog, action) => {
    dialog = action.payload;
  })
);

export default userReducer;
