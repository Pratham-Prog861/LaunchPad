import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import draftPageReducer from "./slices/draft-page-slice";
import uiReducer from "./slices/ui-slice";
import publishReducer from "./slices/publish-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      draftPage: draftPageReducer,
      ui: uiReducer,
      publish: publishReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// ─── Type-safe hooks ───
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
