import { configureStore } from "@reduxjs/toolkit";

import Auth from "./slice/Auth";

const Store = configureStore({
    reducer: {
        auth: Auth
    }
})

export default Store;