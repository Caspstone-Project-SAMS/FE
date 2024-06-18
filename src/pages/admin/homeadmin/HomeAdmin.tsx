import { Content } from 'antd/es/layout/layout';
import React from 'react';
import styles from './HomeAdmin.module.less';
import { Card, Col, Row, Typography } from 'antd';
import { GoPeople } from 'react-icons/go';
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";



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
              <Col span={6}>
                <Card>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.studentTitle}>
                        Students
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.studentSpec}>
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
              <Col span={6}>
                <Card>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.studentTitle}>
                        Teachers
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.studentSpec}>
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
              <Col span={6}>
                <Card>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.studentTitle}>
                        Subjects
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.studentSpec}>
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
              <Col span={6}>
                <Card>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.studentTitle}>
                        Class
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.studentSpec}>
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
        <Col>s</Col>
      </Row>
    </Content>
  );
};

export default HomeAdmin;
