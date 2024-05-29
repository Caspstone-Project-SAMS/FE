import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GoogleLogin_OnSuccess } from '../../models/auth/GoogleResponse';
import { UserInfo } from '../../models/UserInfo';
import authService from '../../hooks/Auth';

interface AuthState {
  authStatus: boolean;
  googleAuth?: GoogleLogin_OnSuccess;
  userDetail?: UserInfo;
  loadingStatus: boolean;
}

const initialState: AuthState = {
  authStatus: false,
  googleAuth: undefined,
  userDetail: undefined,
  loadingStatus: false,
};

const login = createAsyncThunk(
  'auth/login',
  async (arg: { username: string; password: string }) => {
    const { username, password } = arg;
    const result = await authService.login(username, password);
    return result;
  },
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => ({
      ...state,
      loadingStatus: true,
    }));
    builder.addCase(login.fulfilled, (state, { payload }) => {
      // if (state.googleAuth) {
      //   return {
      //     ...state,
      //     authStatus: true,
      //     loadingStatus: false,
      //     googleAuth: googleAuth,
      //   };
      // }
      return {
        ...state,
        authStatus: true,
        loadingStatus: false,
        userDetail: payload,
      };
    });
    builder.addCase(login.rejected, (state) => ({
      ...state,
      loadingStatus: false,
    }));
  },
});

export { login };

export default AuthSlice.reducer;
