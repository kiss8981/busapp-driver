import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetcher } from "../../utils/fetcher";
import type { Provier, Response } from "../../types/Fetcher";

const name = "provider";

export interface ProviderState {
  loading: boolean;
  error: string | null;
  providers: Provier[];
}

const initialState: ProviderState = {
  loading: false,
  error: null,
  providers: [],
};

export const fetchProviders = createAsyncThunk(
  `${name}/providerSlice`,
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetcher.get<Response<Provier[]>>(
        "/auth/providers"
      );

      return data.data;
    } catch (e: any) {
      console.warn(e);
      return rejectWithValue(
        e.message || "클라이언트를 불러오는 중 오류가 발생했습니다."
      );
    }
  }
);

export const providerSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProviders.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = "클라이언트를 불러오는중 오류가 발생했습니다.";
      });
  },
});

export default providerSlice.reducer;
