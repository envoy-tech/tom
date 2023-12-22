import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Location } from "typings/Location";

interface TripState {
  locations: Location[];
  startDate: Date | null;
  endDate: Date | null;
  approximateDuration: number;
}

const initialState = {
  locations: [],
  startDate: null,
  endDate: null,
  approximateDuration: 0,
} as TripState;

const tripSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      state.locations.push(action.payload);
    },
    setLocationNote(
      state,
      action: PayloadAction<{ address: string; notes: string }>
    ) {
      const locationIndex = state.locations.findIndex(
        (location) => location.address === action.payload.address
      );

      state.locations[locationIndex].notes = action.payload.notes;
    },
  },
});

export const { addLocation, setLocationNote } = tripSlice.actions;
export default tripSlice.reducer;
