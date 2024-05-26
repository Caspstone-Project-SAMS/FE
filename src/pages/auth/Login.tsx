import './Login.less'
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"

import decorateImg from '../../assets/imgs/decoration.png';
import logo_rm_bg from '../../assets/imgs/logo-removebg-preview.png';
import ggIcon from '../../assets/icons/googleIcon.png';

import { Input, Checkbox, Typography, Button } from 'antd';
import Icon, { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from '@ant-design/icons';


function Login() {
    const [isRemember, setIsRemember] = useState(false);

    const onChange = () => {
        setIsRemember(!isRemember);
    }

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
                            <h3
                            >Student Attendance Management System</h3>
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
                                prefix={<MailOutlined style={{ marginRight: '10px' }} />}
                            />
                            <Input.Password
                                placeholder="Input password"
                                size="large"
                                className='input'
                                prefix={<LockOutlined style={{ marginRight: '10px' }} />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </div>
                        <div className='additional-opt'>
                            <Checkbox onChange={onChange}>Remember me</Checkbox>
                            <Typography.Link>Forgot password</Typography.Link>
                        </div>
                        <Button size={'large'} className='sign-in-btn' type="primary">Sign in</Button>
                        <div className='other-auth-opt'>
                            <span className='line'></span>
                            <span>Or sign in with</span>
                            <span className='line'></span>
                        </div>
                        <Button className='gg-login-btn' size='large' icon={<Icon component={() => <img className='gg-icon' src={ggIcon} alt='Gg' />} />}>Google</Button>
                        <div className='signUpTxt'>
                            Don't have an account? {'  '}
                            <Link className='nav-link' to={'/register'}>
                                <Typography.Link style={{ fontSize: '1rem' }} strong>Sign Up</Typography.Link>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login