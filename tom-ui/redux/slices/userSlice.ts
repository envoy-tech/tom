import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  referred: boolean;
  ethnicity: number;
  income: number;
  preferredSeason: number;
}

const initialState = {
  email: "",
  referred: false,
  ethnicity: -1,
  income: -1,
  preferredSeason: -1,
} as UserState;

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
    setEthnicity(state, action: PayloadAction<number>) {
      state.ethnicity = action.payload;
    },
    setIncome(state, action: PayloadAction<number>) {
      state.income = action.payload;
    },
    setPreferredSeason(state, action: PayloadAction<number>) {
      state.preferredSeason = action.payload;
    },
  },
});

export const {
  setEmail,
  setReferred,
  setEthnicity,
  setIncome,
  setPreferredSeason,
} = userSlice.actions;
export default userSlice.reducer;
