import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ActiveModule, ActiveModuleFail } from '../../models/module/Module';
import { ModuleService } from '../../hooks/Module';
import { message } from 'antd';

interface ModuleState {
  message?: ActiveModuleFail;
  moduleDetail?: ActiveModule;
  loading: boolean;
}

const initialState: ModuleState = {
  message: undefined,
  moduleDetail: undefined,
  loading: false,
};

// const activeModule = createAsyncThunk(
//   'module/active',
//   async (
//     arg: {
//       ModuleID: number;
//       Mode: number;
//       token: string;
//     },
//     { rejectWithValue },
//   ) => {
//     try {
//       const { ModuleID, Mode, token } = arg;
//       const activeModuleResponse = await ModuleService.activeModule(
//         ModuleID,
//         Mode,
//         token,
//       );
//       console.log("active", activeModule)
//       return activeModuleResponse;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error('Error in active module', {
//           data: error.response?.data,
//         });
//         // message.error(error.message.data.title);
//         return rejectWithValue({
//           data: error.response?.data,
//         });
//       } else {
//         console.error('Unexpected errorrrrr', error);
//         return rejectWithValue({ message: 'Unexpected error' });
//       }
//     }
//   },
// );

const activeModule = createAsyncThunk(
    'module/active',
    async (
      arg: {
        ModuleID: number;
        Mode: number;
        token: string;
      },
      { rejectWithValue },
    ) => {
      try {
        const { ModuleID, Mode, token } = arg;
        const activeModuleResponse = await ModuleService.activeModule(
          ModuleID,
          Mode,
          token,
        );
        console.log("active", activeModuleResponse);
        return activeModuleResponse;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.log('Error:', error.response.data);
          return rejectWithValue(error.response.data);
        } else {
          console.log('Unexpectedd error:', error);
          return rejectWithValue({ error });
        }
      }
    }
  );
  
  


const ModuleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    clearModuleMessages: (state) => {
      state.moduleDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(activeModule.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(activeModule.fulfilled, (state, action) => {
      const { payload } = action;
    //   message.success("Active module successfully");
      return {
        ...state,
        loading: false,
        moduleDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(activeModule.rejected, (state, action) => {
    //   message.error("Active module faillllll");
      return {
        ...state,
        loading: false,
        moduleDetail: undefined,
        message: { data: action.payload || 'Failed to active module' },
      };
    });
  },
});

export const { clearModuleMessages } = ModuleSlice.actions;
export { activeModule };
export default ModuleSlice.reducer;
