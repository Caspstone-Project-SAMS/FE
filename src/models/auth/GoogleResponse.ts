export interface TokenResponse {
  access_token: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

export interface GoogleLogin_OnSuccess {
  access_token: string;
  authuser: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
}

export interface GGUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// {
//   "id": "115029167613704615711",
//   "email": "nhhd.yamj@gmail.com",
//   "verified_email": true,
//   "name": "Đức Nguyễn",
//   "given_name": "Đức",
//   "family_name": "Nguyễn",
//   "picture": "https://lh3.googleusercontent.com/a/ACg8ocKTvTUSRpcskK-2CdBTlMAdy3AC7PnngUrolsbAQ-tvHvQ6-A=s96-c",
//   "locale": "vi"
// }
