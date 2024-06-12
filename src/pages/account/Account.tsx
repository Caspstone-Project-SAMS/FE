import { Content, Header } from 'antd/es/layout/layout';
import React from 'react';
import styles from './Account.module.less'
import { Button, Card, Layout, Space, Typography } from 'antd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxAvatar } from 'react-icons/rx';
import useDispatch from '../../redux/UseDispatch';
import { logout } from '../../redux/slice/Auth';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { UserInfo } from '../../models/UserInfo';



const Account: React.FC = () => {

  const userDetail: UserInfo | undefined = useSelector((state: RootState) => state.auth.userDetail)
  console.log("test:" ,userDetail?.result)
  const dispatch = useDispatch();
  const handleLogout = async () => {
    console.log('test');
    dispatch(logout());
  };
  const teacherDetails = [
    { label: 'Name', value: userDetail?.result?.displayName },
    { label: 'Email', value: userDetail?.result?.email },
    { label: 'Phone', value: userDetail?.result?.phoneNumber },
  ];
  return (
    <Content className={styles.content}>
      <Typography.Title level={3}>Teacher Details</Typography.Title>
      <Space direction="horizontal">
        <text>Teachers / </text>
        <text className={styles.textAccount}>Teachers details</text>
      </Space>
      <Layout style={{ backgroundColor: 'white', marginRight: '20px' }}>
        <Header className={styles.accountHeader}>
          <Space direction="horizontal">
            <Typography.Title level={3}>About Me</Typography.Title>
          </Space>
          <Button shape="circle">
            <BsThreeDotsVertical />
          </Button>
        </Header>
        <Content>
          <Space direction="vertical" className={styles.spaceCard}>
            <Space direction="horizontal" className={styles.card}>
              <Card className={styles.parentCard}>
                <Space style={{ backgroundColor: 'white' }}>
                  <RxAvatar size={40} />
                  <Typography.Title>abc</Typography.Title>
                </Space>
                <Content>
                  <Space direction="horizontal" className={styles.accountInfo}>
                    {teacherDetails.map((detail) => (
                      <Space
                        direction="vertical"
                        className={styles.accountDetails}
                        key={detail.label}
                      >
                        <Typography.Text className={styles.textTitle}>{detail.label}</Typography.Text>
                        <Typography.Title level={4}>
                          {detail.value}
                        </Typography.Title>
                      </Space>
                    ))}
                  </Space>
                </Content>
              </Card>
              <Card className={styles.parentCard}>
                <Header style={{ backgroundColor: 'white' }}></Header>
                <Content>
                  <Space direction="horizontal" className={styles.accountInfo}>
                    {teacherDetails.map((detail) => (
                      <Space
                        direction="vertical"
                        className={styles.accountDetails}
                        key={detail.label}
                      >
                        <Typography.Text className={styles.textTitle}>{detail.label}</Typography.Text>
                        <Typography.Title level={4}>
                          {detail.value}
                        </Typography.Title>
                      </Space>
                    ))}
                  </Space>
                </Content>
              </Card>
            </Space>
            <Space style={{ width: '100%', justifyContent: 'end', paddingRight:40, paddingBottom:30, paddingTop:20 }}>
              <Button className={styles.btn}>Edit</Button>
              <Button className={styles.btnLog} onClick={() => handleLogout()}>Log out</Button>
            </Space>
          </Space>
        </Content>
      </Layout>
    </Content>
  );
};

export default Account;
