import { createSlice } from '@reduxjs/toolkit';
import { GoogleLogin_OnSuccess } from '../../models/auth/GoogleResponse';
import { UserInfo } from '../../models/UserInfo';

interface AuthState {
  googleAuth?: GoogleLogin_OnSuccess;
  userDetail?: UserInfo;
  count: number;
}

const initialState: AuthState = {
  googleAuth: undefined,
  userDetail: undefined,
  count: 0,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
  extraReducers: () => {},
});

export const { increment } = AuthSlice.actions;
export default AuthSlice.reducer;
