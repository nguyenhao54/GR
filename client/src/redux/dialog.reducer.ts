import { createAction, createReducer } from "@reduxjs/toolkit";

export interface Dialog {
  title?: string;
  content?: JSX.Element;
  onClickOk?: () => void;
  onClickClose?: () => void;
  open?: boolean;
  customWidth?: number;
  customHeight?: number;
  loading?: boolean;
  type?: "warning" | "info" | "normal";
  isMessagebar?: boolean;
}

export interface DialogState {
  dialog?: Dialog

}

const initialState: DialogState = {
  dialog: undefined
};

export const setDialog = createAction<Dialog | undefined>("setDialog");

const dialogReducer = createReducer(initialState, (builder) =>
  builder.addCase(setDialog, (state, action) => {
    state.dialog = action.payload;
  })
);

export default dialogReducer;
