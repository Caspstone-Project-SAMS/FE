import axios from "axios";
// import { AuthState } from "../models/auth/AuthState";
// import { GoogleLogin_OnSuccess } from "../models/auth/GoogleResponse";
import { USER_AUTH_API } from ".";
import { UserInfo } from "../models/UserInfo";

const login = async (username: string, password: string): Promise<UserInfo> => {
    const response = await axios.post(USER_AUTH_API + '/login', {
        username,
        password
    })
    if (response.status === 200) {
        window.location.href = '/lecture'
    }
    return response.data as UserInfo
};

const authService = {
    login
}

export default authService