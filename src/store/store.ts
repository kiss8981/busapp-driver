import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import providerSlice from "./slices/providerSlice";
import logger from "redux-logger";

// 스토어 생성
export const store = configureStore({
  reducer: {
    auth: authSlice,
    provider: providerSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

// useSelector 사용시 타입으로 사용하기 위함
export type RootState = ReturnType<typeof store.getState>;

// useDispatch를 좀 더 명확하게 사용하기 위함
export type AppDispatch = typeof store.dispatch;
