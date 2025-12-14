import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: number;
  login: string;
  nomComplet: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean; // NEW: Track if we're loading user data
}

const initialState: AuthState = {
  token: localStorage.getItem('authToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('authToken'), // CHANGED: Start as false until user data is loaded
  isLoading: !!localStorage.getItem('authToken'), // NEW: If token exists, we're loading
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserData }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('authToken', action.payload.token);
    },

    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('authToken');
    },

    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    // NEW: Action to handle when token is invalid
    setAuthFailed: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('authToken');
    },
  },
});

export const { setCredentials, logoutUser, setUser, setAuthFailed } =
  authSlice.actions;

export default authSlice.reducer;
