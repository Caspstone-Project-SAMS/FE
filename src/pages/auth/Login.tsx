import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import useDispatch from '../../redux/UseDispatch';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { login } from '../../redux/slice/Auth';

//assets
import './Login.less'
import decorateImg from '../../assets/imgs/decoration.png';
import logo_rm_bg from '../../assets/imgs/logo-removebg-preview.png';
import ggIcon from '../../assets/icons/googleIcon.png';

//model
import { TokenResponse, GGUserInfo } from '../../models/auth/GoogleResponse';

//antd
import { Input, Checkbox, Typography, Button } from 'antd';
import Icon, { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from '@ant-design/icons';
import AuthService from '../../hooks/Auth';

const initialVal = {
    access_token: '',
    authuser: '',
    expires_in: 0,
    prompt: '',
    scope: '',
    token_type: '',
}

function Login() {
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

    //Havent authorize for lecture or admin
    const handleLogin = async () => {
        const res = await dispatch(login({ username, password }));
        if (res.payload != null) {
            navigate('/')
        }
    }

    const onChange = () => {
        setIsRemember(!isRemember);
        console.log("Auth ----", Auth);
    }

    const loginGG = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log(tokenResponse)
            setUserCode(tokenResponse);
        },
    });

    // redirect to dashboard if already logged in
    useEffect(() => {
        if (authStatus) navigate('/dashboard')
    }, []);

    useEffect(() => {
        if (userCode.access_token) {
            AuthService.getGGInfo(userCode.access_token)
                .then(data => {
                    setUserInfo(data)
                    console.log("User detail when login gg: ", data, userInfo);
                })
                .catch(err => console.log(err));
        }
    }, [userCode])

    // const logOut = () => {
    //     googleLogout();
    //     setUserInfo(null);
    // };

    return (
        <>
            <div className='container'>
                <div className='left'>
                    <div>
                        <div className='decoration-ctn'>
                            <div className='box'>
                                <img className='decorateImg' src={decorateImg} alt="decorate image" />
                            </div>
                        </div>
                        <div className='project-des'>
                            <h3>
                                Student Attendance Management System
                            </h3>
                            <div className='des'>Student Tracking with Fingerprint Sensor,<br /> Managing education needs</div>
                        </div>
                        <div className='logo'>
                            <img className='logo-img' src={logo_rm_bg} alt="App logo" />
                        </div>
                    </div>
                </div>

                <div className='right'>
                    <div className='login-box'>
                        <h2>Sign In to your Account</h2>
                        <div>Welcome back! please enter your detail</div>
                        <div className='login-form' >
                            <Input
                                size="large"
                                placeholder="Email"
                                className='input'
                                onChange={(e) => setUsername(e.target.value)}
                                prefix={<MailOutlined style={{ marginRight: '10px' }} />}
                            />
                            <Input.Password
                                placeholder="Input password"
                                size="large"
                                className='input'
                                onChange={(e) => setPassword(e.target.value)}
                                prefix={<LockOutlined style={{ marginRight: '10px' }} />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </div>
                        <div className='additional-opt'>
                            <Checkbox onChange={onChange}>Remember me</Checkbox>
                            <Typography.Link>Forgot password</Typography.Link>
                        </div>
                        <Button
                            onClick={() => handleLogin()}
                            size={'large'} className='sign-in-btn' type="primary">Sign in</Button>
                        <div className='other-auth-opt'>
                            <span className='line'></span>
                            <span>Or sign in with</span>
                            <span className='line'></span>
                        </div>
                        <Button
                            onClick={() => loginGG()}
                            className='gg-login-btn'
                            size='large'
                            icon={<Icon component={() => <img className='gg-icon' src={ggIcon} alt='Gg' />} />}
                        >
                            Google
                        </Button>
                        <div className='signUpTxt'>
                            Don't have an account? {'  '}
                            <Link className='nav-link' to={'/register'}>
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login



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