import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GoogleLogin_OnSuccess } from '../../models/auth/GoogleResponse';
import { UserInfo } from '../../models/UserInfo';
import AuthService from '../../hooks/Auth';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { HelperService } from '../../hooks/helpers/helperFunc';
import {
  AuthSuccessMessage,
  AuthFailMessage,
} from '../../models/auth/ResetPassword';
import { UserService } from '../../hooks/User';
import useDispatch from '../UseDispatch';
// import axios, { Axios, AxiosError } from 'axios';

// import { history } from '../../hooks/helpers/history';

interface AuthState {
  authStatus: boolean;
  googleAuth?: GoogleLogin_OnSuccess;
  userDetail?: UserInfo;
  loadingStatus: boolean;
  success?: AuthSuccessMessage;
  fail?: AuthFailMessage;
  data?: UserInfo;
  userID?: string;
}

const initialState: AuthState = {
  authStatus: false,
  googleAuth: undefined,
  userDetail: undefined,
  loadingStatus: false,
  success: undefined,
  fail: undefined,
  data: undefined,
  userID: undefined,
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
const updateUser2 = createAsyncThunk(
  'auth/updateUser2',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const userAuth = localStorage.getItem('userAuth');
      if (userAuth) {
        const userInfo: UserInfo = HelperService.decryptString(userAuth);
        console.log('Yes, im in updateUser!!!!', userInfo.result?.id);
        dispatch(getUserByID({ UserId: userInfo.result?.id || '' }));

        return userInfo;
      }
    } catch (error) {
      rejectWithValue('err');
    }
  },
);

// const updateName = createAction('auth/updateName', (name) => {
//   return {
//     payload: name
//   }
// });

const login = createAsyncThunk(
  'auth/login',
  async (
    arg: { username: string; password: string; isRemember: boolean },
    { rejectWithValue, dispatch },
  ) => {
    const { username, password, isRemember } = arg;
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
      if (result && isRemember) {
        const session = {
          loginTime: new Date().getTime(),
          expiredTime: new Date().getTime() + 43200000,
        };

        localStorage.setItem(
          'userAuth',
          HelperService.encryptString(JSON.stringify(result)),
        );
        localStorage.setItem('session', JSON.stringify(session));
      }
      console.log('User result here ', result);
      dispatch(getUserByID({ UserId: result?.result?.id || '' }));
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
  async (arg: { accessToken: string }, { rejectWithValue, dispatch }) => {
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
      // if (result) {
      //   const session = {
      //     loginTime: new Date().getTime(),
      //     expiredTime: new Date().getTime() + 43200000,
      //   };

      //   localStorage.setItem(
      //     'userAuth',
      //     HelperService.encryptString(JSON.stringify(result)),
      //   );
      //   localStorage.setItem('session', JSON.stringify(session));
      // }
      console.log('User result here ', result);
      dispatch(getUserByID({ UserId: result?.result?.id || '' }));
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

const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async (
    arg: {
      UserId: string;
      OldPassword: string;
      NewPassword: string;
      ConfirmPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { UserId, OldPassword, NewPassword, ConfirmPassword } = arg;
      const resetPasswordResponse = await AuthService.resetPassword(
        UserId,
        OldPassword,
        NewPassword,
        ConfirmPassword,
      );
      return resetPasswordResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in reset password', {
          data: error.message,
        });
        // message.error(error.message.data.title);
        return rejectWithValue({
          data: error.message,
        });
      } else {
        console.error('Unexpected error', error);
        return rejectWithValue({ message: 'Unexpected error' });
      }
    }
  },
);

const editProfile = createAsyncThunk(
  'auth/edit-profile',
  async (
    arg: {
      UserId: string;
      Email: string;
      PhoneNumber: string;
      Avatar: File | null;
      DisplayName: string;
      Address: string;
      DOB: string;
      Gender: number;
      FirstName: string;
      LastName: string;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const {
        UserId,
        Email,
        PhoneNumber,
        Avatar,
        DisplayName,
        Address,
        DOB,
        Gender,
        FirstName,
        LastName,
      } = arg;
      const editProfileResponse = await AuthService.editProfile(
        UserId,
        Email,
        PhoneNumber,
        Avatar,
        DisplayName,
        Address,
        DOB,
        Gender,
        FirstName,
        LastName,
      );
      dispatch(getUserByID({ UserId: UserId }));
      return editProfileResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in reset password', {
          data: error.message,
        });
        // message.error(error.message.data.title);
        return rejectWithValue({
          data: error.message,
        });
      } else {
        console.error('Unexpected error', error);
        return rejectWithValue({ message: 'Unexpected error' });
      }
    }
  },
);

const getUserByID = createAsyncThunk(
  'user/get-user-by-id',
  async (
    arg: {
      UserId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { UserId } = arg;
      const getUserByIDResponse = await UserService.getUserByID(UserId);
      return getUserByIDResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in reset password', {
          data: error.message,
        });
        // message.error(error.message.data.title);
        return rejectWithValue({
          data: error.message,
        });
      } else {
        console.error('Unexpected error', error);
        return rejectWithValue({ message: 'Unexpected error' });
      }
    }
  },
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userAuth');
      localStorage.removeItem('session');

      state.authStatus = false;
      state.loadingStatus = false;
      state.googleAuth = undefined;
      state.userDetail = undefined;
    },
    clearResetPasswordMessages: (state) => {
      state.success = undefined;
      state.fail = undefined;
    },
  },
  extraReducers: (builder) => {
    //CreateAction
    builder.addCase(updateUser, (state, action) => {
      const userAuth = localStorage.getItem('userAuth');
      if (userAuth) {
        const userInfo: UserInfo = HelperService.decryptString(userAuth);
        console.log('Yes, im in updateUser!!!!', userInfo.result?.id);
        // const dispatch = useDispatch();
        // dispatch(getUserByID({ UserId: userInfo.result?.id || '' }));
        getUserByID({ UserId: userInfo.result?.id || '' });

        state.authStatus = true;
        state.loadingStatus = false;
        state.userDetail = userInfo;
      }
    });
    // builder.addCase(updateName, (state, {payload}) => {
    //   const {name} = payload
    //   console.log("in the udpate name", name);
    //     if(payload && state && state.userDetail && state.userDetail.result){
    //       return {
    //         ...state,
    //         userDetail: {
    //           ...state.userDetail,
    //           result: {
    //             ...state.userDetail.result,
    //             displayName: name
    //           }
    //         }
    //       }
    //     }
    // });

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
        userID: payload?.result?.id,
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
    builder.addCase(updateUser2.fulfilled, (state, { payload }) => {
      return {
        ...state,
        authStatus: true,
        loadingStatus: false,
        userDetail: payload,
      };
    }),
      builder.addCase(updateUser2.rejected, (state) => {
        return {
          ...state,
          userDetail: undefined,
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
    builder.addCase(resetPassword.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        success: payload,
        fail: undefined,
      };
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        success: undefined,
        fail: { data: action.payload || 'Failed to reset password' },
      };
    });
    builder.addCase(editProfile.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(editProfile.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        success: payload,
        fail: undefined,
      };
    });
    builder.addCase(editProfile.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        success: undefined,
        fail: { data: action.payload || 'Failed to edit profile' },
      };
    });
    builder.addCase(getUserByID.fulfilled, (state, action) => {
      const { payload } = action;
      console.log('IN the getuserbyId --------', payload);
      return {
        ...state,
        data: payload,
      };
    });
  },
});

export {
  login,
  loginGG,
  fakeLogin,
  updateUser,
  resetPassword,
  editProfile,
  getUserByID,
  updateUser2,
  // updateName,
};
export const { logout, clearResetPasswordMessages } = AuthSlice.actions;

export default AuthSlice.reducer;

// if (state.googleAuth) {
//   return {
//     ...state,
//     authStatus: true,
//     loadingStatus: false,
//     googleAuth: googleAuth,
//   };
// }
