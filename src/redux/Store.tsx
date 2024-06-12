import { configureStore } from "@reduxjs/toolkit";

import Auth from "./slice/Auth";
import Calendar from './slice/Calendar';

const Store = configureStore({
    reducer: {
        auth: Auth,
        calendar: Calendar
    },
})

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;