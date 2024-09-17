import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDispatch from '../../redux/UseDispatch';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { getUserByID, login, loginGG, updateUser, updateUser2 } from '../../redux/slice/Auth';

//assets
import styles from './Login.module.less';
import decorateImg from '../../assets/imgs/decoration.png';
import logo_rm_bg from '../../assets/imgs/logo-removebg-preview.png';
import ggIcon from '../../assets/icons/googleIcon.png';

//model
import { TokenResponse, GGUserInfo } from '../../models/auth/GoogleResponse';

//antd
import { Input, Checkbox, Typography, Button } from 'antd';
import Icon, {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import AuthService from '../../hooks/Auth';

const initialVal = {
  access_token: '',
  authuser: '',
  expires_in: 0,
  prompt: '',
  scope: '',
  token_type: '',
};

interface RoutersProps {
  ConnectWebsocket: (tokenString: string) => void
}

const Login: React.FC<RoutersProps> = ({
  ConnectWebsocket
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRemember, setIsRemember] = useState(false);
  //Google login info
  const [userCode, setUserCode] = useState<TokenResponse>(initialVal);
  const [userInfo, setUserInfo] = useState<GGUserInfo | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const Auth = useSelector((state: RootState) => state.auth);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  //get role
  const role = Auth.userDetail?.result?.role.name;

  const handleLogin = async () => {
    await dispatch(login({ username, password, isRemember }));
    // const res = await dispatch(login({ username, password }));
    // if (res.payload != null) {
    //     navigate('/')
    // }
  };

  const onChange = () => {
    setIsRemember(!isRemember);
    // console.log('Auth ----', Auth);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Token on success", tokenResponse);
      const token = tokenResponse.access_token
      dispatch(loginGG({ accessToken: token }))
      setUserCode(tokenResponse);
      // dispatch(fakeLogin());
    },
  });

  // redirect to dashboard if already logged in
  useEffect(() => {
    const currentTime = new Date().getTime();
    const oldSession = localStorage.getItem('session');
    if (oldSession) {
      const { expiredTime } = JSON.parse(oldSession);
      if (expiredTime >= currentTime) {
        dispatch(updateUser2());
      }
    } else {
      localStorage.removeItem('userAuth');
      localStorage.removeItem('session');
    }

    if (authStatus) navigate('/dashboard')
  }, []);

  //after login, check role and then navigate
  useEffect(() => {
    if (role === 'Lecturer') {
      ConnectWebsocket(Auth.userDetail?.token as string);
      navigate('/home');
    } else if (role === 'Admin') {
      ConnectWebsocket(Auth.userDetail?.token as string);
      navigate('/home');
    } else if (role === 'Student') {
      navigate('/student');
    } else if (role === 'SupAdmin') {
      navigate('/script/set-reset-time')
    }
  }, [role, navigate]);

  useEffect(() => {
    if (userCode.access_token) {
      AuthService.getGGInfo(userCode.access_token)
        .then((data) => {
          setUserInfo(data);
          console.log('User detail when login gg: ', data, userInfo);
        })
        .catch((err) => console.log(err));
    }
  }, [userCode]);

  const logOut = () => {
    googleLogout();
    setUserInfo(null);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <div>
            <div className={styles.decorationCtn}>
              <div className={styles.box}>
                <img
                  className={styles.decorateImg}
                  src={decorateImg}
                  alt="decorate image"
                />
              </div>
            </div>
            <div className={styles.projectDes}>
              <h3>Student Attendance Management System</h3>
              <div className={styles.des}>
                Student Tracking with Fingerprint Sensor,
                <br /> Managing education needs
              </div>
            </div>
            <div className={styles.logo}>
              <img className={styles.logoImg} src={logo_rm_bg} alt="App logo" />
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.loginBox}>
            <h2>Sign In to your Account</h2>
            <div>Welcome back! Please enter your detail</div>
            <div className={styles.loginForm}>
              <Input
                size="large"
                placeholder="Email or username"
                className={styles.input}
                onChange={(e) => setUsername(e.target.value)}
                prefix={<MailOutlined style={{ marginRight: '10px' }} />}
              />
              <Input.Password
                placeholder="Input password"
                size="large"
                className={styles.input}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<LockOutlined style={{ marginRight: '10px' }} />}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>
            <div className={styles.additionalOpt}>
              <Checkbox onChange={onChange}>Remember me</Checkbox>
              <Typography.Link
                onClick={() => {
                  // logOut();
                  navigate('/forgot-password')
                }}
              >
                Forgot password
              </Typography.Link>
            </div>
            <Button
              onClick={() => handleLogin()}
              size={'large'}
              className={styles.signInBtn}
              type="primary"
            >
              Sign in
            </Button>
            <div className={styles.otherAuthOpt}>
              <span className={styles.line}></span>
              <span>Or sign in with</span>
              <span className={styles.line}></span>
            </div>
            <Button
              onClick={() => loginGoogle()}
              className={styles.ggLoginBtn}
              size="large"
              icon={
                <Icon
                  component={() => (
                    <img className={styles.ggIcon} src={ggIcon} alt="Gg" />
                  )}
                />
              }
            >
              Google
            </Button>
            <div className={styles.signUpTxt}>
              Don't have an account?{' '}
              <a
                className={styles.navLink}
                href="mailto:ducnhhse161458@fpt.edu.vn"
              >
                Contact Us!
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

//Error note feature
// const [isError, setIsError] = useState(false);
// {
//     isError ? (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1.4 }}
//         >
//             <Typography.Text >Error mate</Typography.Text>
//         </motion.div>
//     ) : ('')
// }
// onClick={() => setIsError(!isError)}
