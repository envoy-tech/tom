import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  referred: boolean;
}

const initialState = { email: "", referred: false } as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setReferred(state, action: PayloadAction<boolean>) {
      state.referred = action.payload;
    },
  },
});

export const { setEmail, setReferred } = userSlice.actions;
export default userSlice.reducer;
