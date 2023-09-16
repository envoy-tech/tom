import { configureStore } from "@reduxjs/toolkit";
// Import your reducers
export const store = configureStore({
  reducer: {
    // Add more reducers as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
