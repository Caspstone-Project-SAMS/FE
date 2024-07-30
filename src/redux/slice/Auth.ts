import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GoogleLogin_OnSuccess } from '../../models/auth/GoogleResponse';
import { UserInfo } from '../../models/UserInfo';
import AuthService from '../../hooks/Auth';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
// import axios, { Axios, AxiosError } from 'axios';

// import { history } from '../../hooks/helpers/history';

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
const curDate = new Date();
const fakeUser = {
  token: '1233333',
  result: {
    id: 'string',
    email: 'string',
    normalizedEmail: 'string',
    emailConfirmed: true,
    phoneNumber: 'string',
    phoneNumberConfirmed: 'string',
    twoFactorEnabled: 'string',
    lockoutEnd: 'string',
    lockoutEnabled: 'string',
    filePath: 'string',
    displayName: 'string',
    role: {
      id: 'string',
      name: 'Lecturer',
      createdBy: 'string',
      createdAt: curDate,
    },
    createdBy: 'string',
    createdAt: curDate,
  },
};

const fakeLogin = createAction('auth/fakeLogin');

const updateUser = createAction('auth/updateUser');

const login = createAsyncThunk(
  'auth/login',
  async (arg: { username: string; password: string }, { rejectWithValue }) => {
    const { username, password } = arg;
    try {
      //Toast chỉ nhận promise, nhưng redux async thunk cần trả về promise đã hoàn thành để thực hiện pending, fulfilled,...
      const loginPromise = AuthService.login(username, password);
      toast.promise(loginPromise, {
        success: 'Login successfully',
        error: (err) => {
          if (err.message.includes('Network Error')) {
            return 'Server is busy right now. Please try again later.';
          } else return 'Invalid Credentials';
        },
        loading: 'Loading...',
      });

      const result = await loginPromise;
      if (result) {
        const session = {
          loginTime: new Date().getTime(),
          expiredTime: new Date().getTime() + 43200000,
        };

        localStorage.setItem('userAuth', JSON.stringify(result));
        localStorage.setItem('session', JSON.stringify(session));
      }
      console.log('User result here ', result);
      return result;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('hi error here ', error);
        throw new AxiosError(error.response);
      }
      return rejectWithValue(error.message.data);
    }
  },
);

const loginGG = createAsyncThunk(
  'auth/loginGG',
  async (arg: { accessToken: string }, { rejectWithValue }) => {
    const { accessToken } = arg;
    try {
      //Toast chỉ nhận promise, nhưng redux async thunk cần trả về promise đã hoàn thành để thực hiện pending, fulfilled,...
      const loginPromise = AuthService.loginGG(accessToken);
      toast.promise(loginPromise, {
        success: 'Login successfully',
        error: (err) => {
          if (err.message.includes('Network Error')) {
            return 'Server is busy right now. Please try again later.';
          } else return 'Invalid Credentials';
        },
        loading: 'Loading...',
      });

      const result = await loginPromise;
      console.log('User result here ', result);
      return result;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('hi error here ', error);
        throw new AxiosError(error.response);
      }
      return rejectWithValue(error.message.data);
    }
  },
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authStatus = false;
      state.loadingStatus = false;
      state.googleAuth = undefined;
      state.userDetail = undefined;
    },
  },
  extraReducers: (builder) => {
    //CreateAction
    builder.addCase(updateUser, (state, action) => {
      const user = action.payload;
    });

    //AsyncThunk
    builder.addCase(login.pending, (state) => {
      return {
        ...state,
        loadingStatus: true,
      };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        authStatus: true,
        loadingStatus: false,
        userDetail: payload,
      };
    });
    builder.addCase(login.rejected, (state) => {
      return {
        ...state,
        authStatus: false,
        loadingStatus: false,
      };
    });
    builder.addCase(loginGG.pending, (state) => {
      return {
        ...state,
        loadingStatus: true,
      };
    });
    builder.addCase(loginGG.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        authStatus: true,
        loadingStatus: false,
        userDetail: payload,
      };
    });
    builder.addCase(loginGG.rejected, (state) => {
      return {
        ...state,
        authStatus: false,
        loadingStatus: false,
      };
    });
    builder.addCase(fakeLogin, (state) => {
      // let result = state.userDetail?.result?.roles[0].name;
      // result = 'Lecturer';
      // const detail = { ...state.userDetail, result };
      state.authStatus = true;
      state.loadingStatus = false;
      // state.userDetail = fakeUser;
    });
  },
});

export { login, loginGG, fakeLogin };
export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;

// if (state.googleAuth) {
//   return {
//     ...state,
//     authStatus: true,
//     loadingStatus: false,
//     googleAuth: googleAuth,
//   };
// }
