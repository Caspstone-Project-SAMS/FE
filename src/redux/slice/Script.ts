import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ScriptService } from '../../hooks/Script';
import { ScriptResponse } from '../../models/script/Script';
import { AxiosError } from 'axios';
import { message } from 'antd';
interface ScriptState {
  message?: ScriptResponse;
  scriptDetail?: ScriptResponse;
  loading: boolean;
}

const initialState: ScriptState = {
  message: undefined,
  scriptDetail: undefined,
  loading: false,
};


const resetTime = createAsyncThunk(
  'script/reset',
  async (
    arg: {
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { token } = arg;
      const resetTimeResponse = await ScriptService.resetTime(
        token
      );
      return resetTimeResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in reset time', {
          data: error.message,
        });
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

const resgisterAllFingerprint = createAsyncThunk(
  'script/register-fingerprint',
  async (
    arg: {
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { token } = arg;
      const registerFinperprintResponse = await ScriptService.registerAllFingerprint(
        token
      );
      return registerFinperprintResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in register fingerprint', {
          data: error.message,
        });
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

const setTime = createAsyncThunk(
  'script/set-time',
  async (
    arg: {
      Resource: string;
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { Resource, token } = arg;
      const setTimeResponse = await ScriptService.setTime(
        Resource,
        token,
      );
      return setTimeResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in set time', {
          data: error.message,
        });
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



const ScriptSlice = createSlice({
  name: 'script',
  initialState,
  reducers: {
    clearScriptMessages: (state) => {
      state.scriptDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetTime.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(resetTime.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        scriptDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(resetTime.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        scriptDetail: undefined,
        message: { data: action.payload || 'Failed reset time' },
      };
    });
    builder.addCase(resgisterAllFingerprint.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(resgisterAllFingerprint.fulfilled, (state, action) => {
      const { payload } = action;
      message.success('Register all fingerprint successfully');
      return {
        ...state,
        loading: false,
        scriptDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(resgisterAllFingerprint.rejected, (state, action) => {
      message.error('Register all fingerprint failed');
      return {
        ...state,
        loading: false,
        scriptDetail: undefined,
        message: { data: action.payload || 'Failed register all fingerprint' },
      };
    });
    builder.addCase(setTime.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(setTime.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        scriptDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(setTime.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        scriptDetail: undefined,
        message: { data: action.payload || 'Failed to set time' },
      };
    });
  },
});

export const { clearScriptMessages } = ScriptSlice.actions;
export { resetTime, resgisterAllFingerprint, setTime };
export default ScriptSlice.reducer;
