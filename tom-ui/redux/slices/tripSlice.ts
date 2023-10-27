import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Location } from "typings/Location";

interface TripState {
  locations: Location[];
}

const initialState = {
  locations: [],
} as TripState;

const tripSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      state.locations.push(action.payload);
    },
    editLocationNote(state, action: PayloadAction<string>) {},
  },
});

export const { addLocation } = tripSlice.actions;
export default tripSlice.reducer;
