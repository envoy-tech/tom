import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ToastState {
  type: "info" | "error" | "loading" | "plain";
  active?: boolean;
  text: string;
  timeout?: number;
}

const initialState = {
  type: "info",
  active: false,
  text: "",
  timeout: 3000,
} as ToastState;

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast(state, action: PayloadAction<ToastState>) {
      const { type, text } = action.payload;
      state.active = true;
      state.type = type;
      state.text = text;

      if (action.payload.timeout) {
        state.timeout = action.payload.timeout;
      }
    },
    setActive(state, action: PayloadAction<boolean>) {
      state.active = action.payload;
    },
  },
});

export const { setToast, setActive } = toastSlice.actions;
export default toastSlice.reducer;
