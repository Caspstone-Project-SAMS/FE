import { Content } from 'antd/es/layout/layout';
import React from 'react';
import styles from './HomeAdmin.module.less';
import { Card, Col, Row, Typography } from 'antd';
import { GoPeople } from 'react-icons/go';
import { PiStudent } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import HomeCalendar from '../../../components/calendar/HomeCalendar';

const HomeAdmin: React.FC = () => {
  return (
    <Content className={styles.homeAdminContent}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Typography.Text className={styles.title}>
                Admin Dashboard
              </Typography.Text>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#f1e7ff' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Students
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        12.0K
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <PiStudent size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#e5f5ff' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Teachers
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        500
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <GiTeacher size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#ffefe7' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Subjects
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        100
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <GoPeople size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#ebfdef' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Class
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        20
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <GoPeople size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <HomeCalendar />
      </Row>
    </Content>
  );
};

export default HomeAdmin;
