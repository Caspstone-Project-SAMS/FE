import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//assets
import styles from './Login.module.less';
import decorateImg from '../../assets/imgs/decoration.png';
import logo_rm_bg from '../../assets/imgs/logo-removebg-preview.png';
import forgotPassImg from '../../assets/imgs/forgotPassword.jpg';
import { Button, Input } from 'antd';
import { CaretLeftOutlined, MailOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast'
import AuthService from '../../hooks/Auth';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate();
    const handleSubmit = () => {
        if (email.trim().length === 0) {
            toast.error('Email can not be blanked!!!')
        } else {
            const promise = AuthService.forgotPassword(email);
            toast.promise(promise, {
                success: 'An reset password email has sent to you!',
                error: (err) => {
                    if (err.message.includes('Network Error')) {
                        return 'Server is busy right now. Please try again later.';
                    } else return 'Email not found, please try again.';
                },
                loading: 'Loading...',
            });
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.left}>
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

                <div className={styles.right}>
                    <div className={styles.forgotPassBox}>
                        <h2>Forgot Password</h2>
                        <div>Enter your email to get a reset password link</div>
                        <div className={styles.imageCtn}>
                            <img className={styles.forgotPassImg} src={forgotPassImg} alt='Forgot password image' />
                        </div>
                        <Input
                            size="large"
                            placeholder="Email or username"
                            className={styles.input}
                            onChange={(e) => setEmail(e.target.value)}
                            prefix={<MailOutlined style={{ marginRight: '10px' }} />}
                        />
                        <Button
                            onClick={() => handleSubmit()}
                            size={'large'}
                            className={styles.signInBtn}
                            type="primary"
                        >
                            Submit
                        </Button>
                    </div>
                    <Button
                        type='text'
                        onClick={() => { navigate('/login') }}
                        style={{ position: 'absolute', top: 15, left: 10 }}
                    >
                        <CaretLeftOutlined style={{ fontSize: 18 }} />
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
