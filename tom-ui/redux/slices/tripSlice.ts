import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Location, Traveler } from "typings";

interface TripState {
  locations: Location[];
  startDate: string;
  endDate: string;
  approximateDuration: number;
  startingLocation: string;
  endingLocation: string;
  tripName: string;
  travelers: Traveler[];
}

const initialState = {
  locations: [],
  startDate: "",
  endDate: "",
  approximateDuration: 0,
  startingLocation: "",
  endingLocation: "",
  tripName: "",
  travelers: [],
} as TripState;

const tripSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      state.locations.push(action.payload);
    },
    removeLocation(state, action: PayloadAction<string>) {
      state.locations = state.locations.filter(
        (location) => location.address !== action.payload
      );
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
    setLocationInterest(
      state,
      action: PayloadAction<{ address: string; interest: number }>
    ) {
      const locationIndex = state.locations.findIndex(
        (location) => location.address === action.payload.address
      );

      state.locations[locationIndex].interest = action.payload.interest;
    },
    setLocationTime(
      state,
      action: PayloadAction<{ address: string; timeAllocated: number }>
    ) {
      const locationIndex = state.locations.findIndex(
        (location) => location.address === action.payload.address
      );

      state.locations[locationIndex].timeAllocated =
        action.payload.timeAllocated;
    },
    setStartDate(state, action: PayloadAction<string>) {
      state.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<string>) {
      state.endDate = action.payload;
    },
    setApproximateDuration(state, action: PayloadAction<number>) {
      state.approximateDuration = action.payload;
    },
    setStartingLocation(state, action: PayloadAction<string>) {
      state.startingLocation = action.payload;
    },
    setEndingLocation(state, action: PayloadAction<string>) {
      state.endingLocation = action.payload;
    },
    setTripName(state, action: PayloadAction<string>) {
      state.tripName = action.payload;
    },
    setTravelers(state, action: PayloadAction<Traveler[]>) {
      state.travelers = action.payload;
    },
    addTraveler(state, action: PayloadAction<Traveler>) {
      state.travelers.push(action.payload);
    },
  },
});

export const {
  addLocation,
  removeLocation,
  setLocationNote,
  setLocationInterest,
  setLocationTime,
  setStartDate,
  setEndDate,
  setApproximateDuration,
  setStartingLocation,
  setEndingLocation,
  setTripName,
  addTraveler,
  setTravelers,
} = tripSlice.actions;
export default tripSlice.reducer;
