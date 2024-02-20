import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { fetcher } from "../../utils/fetcher";
import { Response } from "../../types/Fetcher";

const name = "auth";

export interface AuthState {
  loading: boolean;
  authenticate: boolean;
  error: string | null;
  token: {
    access: string | null;
    refresh: string | null;
  };
  user: {
    id: string | null;
    name: string | null;
    provider: string | null;
    routes: Route[];
  };
}

export interface Route {
  id: string;
  name: string;
}

const initialState: AuthState = {
  loading: false,
  authenticate: false,
  error: null,
  token: {
    access: null,
    refresh: null,
  },
  user: {
    id: null,
    name: null,
    provider: null,
    routes: [],
  },
};

export const fetchAuth = createAsyncThunk(
  `${name}/authSlice`,
  async (_, { rejectWithValue }) => {
    try {
      const access_token = await SecureStore.getItemAsync("accessToken");
      const refresh_token = await SecureStore.getItemAsync("refreshToken");
      const provier = await SecureStore.getItemAsync("provider");

      if (!access_token || !refresh_token || !provier) {
        return rejectWithValue({
          token: {
            access: null,
            refresh: null,
          },
          user: {
            id: null,
            name: null,
            provider: null,
          },
        });
      }

      try {
        const { data } = await fetcher.post("/auth/authenticate", {
          token: access_token,
          tokenType: "access",
          provider: provier,
        });

        return {
          user: {
            id: data.id,
            name: data.provider.name,
            provider: provier,
            routes: data.provider.route,
          },
        };
      } catch (e) {
        try {
          const { data } = await fetcher.post<
            Response<{
              accessToken: string;
              refreshToken: string;
              id: string;
              provider: {
                name: string;
                route: Route[];
              };
            }>
          >("/auth/authenticate/refresh", {
            token: refresh_token,
            tokenType: "refresh",
            provider: provier,
          });

          await SecureStore.setItemAsync("accessToken", data.data.accessToken);
          await SecureStore.setItemAsync(
            "refreshToken",
            data.data.refreshToken
          );

          return {
            token: {
              access: data.data.accessToken,
              refresh: data.data.refreshToken,
            },
            user: {
              id: data.data.id,
              name: data.data.provider.name,
              provider: provier,
              routes: data.data.provider.route,
            },
          };
        } catch (e) {
          return rejectWithValue({
            token: {
              access: null,
              refresh: null,
            },
            user: {
              id: null,
              name: null,
              provider: null,
            },
          });
        }
      }
    } catch (e) {
      return rejectWithValue({
        token: {
          access: null,
          refresh: null,
        },
        user: {
          id: null,
          name: null,
          provider: null,
        },
      });
    }
  }
);

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAuth.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticate = true;
        state.error = null;
        state.token = action.payload.token ? action.payload.token : state.token;
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.name,
          provider: action.payload.user.provider,
          routes: action.payload.user.routes,
        };
      })
      .addCase(fetchAuth.rejected, (state, action) => {
        state.loading = false;
        state.authenticate = false;
        state.token = {
          access: null,
          refresh: null,
        };
        state.user = {
          id: null,
          name: null,
          provider: null,
          routes: [],
        };
      });
  },
});

export default authSlice.reducer;
