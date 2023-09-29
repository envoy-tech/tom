"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

import { persistStore } from "redux-persist";

persistStore(store); // persist the store

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
