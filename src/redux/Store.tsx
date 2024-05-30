import { configureStore } from "@reduxjs/toolkit";

import Auth from "./slice/Auth";

const Store = configureStore({
    reducer: {
        auth: Auth
    },
})

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;