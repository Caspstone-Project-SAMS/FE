import { UserInfo } from '../UserInfo';
import { GoogleLogin_OnSuccess } from './GoogleResponse';

export interface AuthState {
  googleAuth?: GoogleLogin_OnSuccess;
  userDetail?: UserInfo;
}
