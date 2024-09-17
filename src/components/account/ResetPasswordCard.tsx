import { Content, Header } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from '../../pages/account/Account.module.less';
import {
  Avatar,
  Button,
  Card,
  Input,
  Layout,
  message,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import useDispatch from '../../redux/UseDispatch';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import {
  clearResetPasswordMessages,
  resetPassword,
} from '../../redux/slice/Auth';

const ResetPasswordCard: React.FC = () => {
  const UserId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id,
  );

  const failMessage = useSelector((state: RootState) => state.auth.fail);
  const successMessage = useSelector(
    (state: RootState) => state.auth.success?.title,
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const [OldPassword, setOldPassword] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  });

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      resetFields();
      dispatch(clearResetPasswordMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.errors}`);
      dispatch(clearResetPasswordMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const handleSubmit = async () => {
    const validationErrors: any = {};

    if (!OldPassword) {
      validationErrors.OldPassword = 'Old password is required';
    }

    if (!NewPassword) {
      validationErrors.NewPassword = 'New password is required';
    }

    if (!ConfirmPassword) {
      validationErrors.ConfirmPassword = 'Confirm password is required';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    if (UserId) {
      await resetNewPassword(UserId, OldPassword, NewPassword, ConfirmPassword);
    }
    setLoading(false);
    resetFields();
  };

  const resetFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({
      NewPassword: '',
      OldPassword: '',
      ConfirmPassword: '',
    });
  };

  const resetNewPassword = async (
    UserId: string,
    OldPassword: string,
    NewPassword: string,
    ConfirmPassword: string,
  ) => {
    const arg = {
      UserId: UserId,
      OldPassword: OldPassword,
      NewPassword: NewPassword,
      ConfirmPassword: ConfirmPassword,
    };
    await dispatch(resetPassword(arg) as any);
    setIsCheck(false);
  };

  return (
    <Content className={styles.content}>
      {/* <ContentHeader
        contentTitle="Reset Password"
        previousBreadcrumb="Teachers / Teachers details / "
        currentBreadcrumb="Reset Password"
        key={'account-header'}
      /> */}

      <Layout style={{ backgroundColor: 'white', marginRight: '20px' }}>
        {/* <Header
          style={{
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
          className={styles.accountHeader}
        >
          <Space direction="horizontal">
            <Typography.Title level={3}>Reset Password</Typography.Title>
          </Space>
        </Header> */}
        <Content style={{ width: '40%', marginLeft: 20 }}>
          <label style={{ fontWeight: 'bold' }} htmlFor="date">
            Current Password
          </label>
          <Input.Password
            placeholder="Old Password"
            type="password"
            value={OldPassword}
            onChange={(e) => {
              setErrors((prevErrors) => ({ ...prevErrors, OldPassword: '' }));
              setOldPassword(e.target.value);
            }}
            style={{ marginBottom: '10px', height: 40, marginTop: 10 }}
          />
          {errors.OldPassword && (
            <p className={styles.errorText}>{errors.OldPassword}</p>
          )}
          <label style={{ fontWeight: 'bold' }} htmlFor="date">
            New Password
          </label>{' '}
          <Input.Password
            placeholder="New Password"
            type="password"
            value={NewPassword}
            onChange={(e) => {
              setErrors((prevErrors) => ({ ...prevErrors, NewPassword: '' }));
              setNewPassword(e.target.value);
            }}
            style={{ marginBottom: '10px', height: 40, marginTop: 10 }}
          />
          {errors.NewPassword && (
            <p className={styles.errorText}>{errors.NewPassword}</p>
          )}
          <label style={{ fontWeight: 'bold' }} htmlFor="date">
            Confirm Password
          </label>{' '}
          <Input.Password
            placeholder="Confirm Password"
            type="password"
            value={ConfirmPassword}
            onChange={(e) => {
              setErrors((prevErrors) => ({
                ...prevErrors,
                ConfirmPassword: '',
              }));
              setConfirmPassword(e.target.value);
            }}
            style={{ marginBottom: '10px', height: 40, marginTop: 10 }}
          />
          {errors.ConfirmPassword && (
            <p className={styles.errorText}>{errors.ConfirmPassword}</p>
          )}
          <Popconfirm
            title="Are you sure you want to reset your password?"
            onConfirm={handleSubmit}
            onCancel={() => message.info('Password reset cancelled')}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              style={{ marginBottom: 20 }}
              loading={loading}
            >
              Submit
            </Button>
          </Popconfirm>
        </Content>
      </Layout>
    </Content>
  );
};

export default ResetPasswordCard;
