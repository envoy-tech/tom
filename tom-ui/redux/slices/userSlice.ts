import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
}

const initialState = { email: "" } as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
      return state;
    },
  },
});

export const { setEmail } = userSlice.actions;
export default userSlice.reducer;
