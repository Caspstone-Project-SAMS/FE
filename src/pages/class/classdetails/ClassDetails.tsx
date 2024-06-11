import styles from '../Class.module.less';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import { Button, Card, Col, Row, Space, Typography } from 'antd';

import { VscChecklist } from 'react-icons/vsc';
import { IoIosFingerPrint } from 'react-icons/io';
import module from '../../../assets/imgs/module.png'
import fptimg from '../../../assets/imgs/FPT-Logo-PNG.png'

import ClassDetailTable from '../../../components/classdetails/ClassDetailTable';
import toast from 'react-hot-toast';

const ClassDetails: React.FC = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const { scheduleID, classCode, room, slot, start, end, status, subjectCode } = event || {}

  const [classInfo, setClassInfo] = useState<{ label: string, value: string }[]>([]);


  // console.log("Hi im in the class detail ", location);
  // console.log("Hi im in the class detail ", event);

  const checkingStatus = (status: string) => {
    switch (status) {
      case 'Past':
        return styles.pastStatus;
      case 'On going':
        return styles.currentStatus;
      case 'Future':
        return styles.futureStatus;
      default:
        return styles.normalTxt;
    }
  }

  useEffect(() => {
    try {
      const date = start.getDate() + '/' + start.getMonth() + '/' + start.getFullYear();
      const startTime = start.getHours().toString().padStart(2, '0') + ":" + start.getMinutes().toString().padStart(2, '0')
      const endTime = end.getHours().toString().padStart(2, '0') + ":" + end.getMinutes().toString().padStart(2, '0')
      const slotTime = slot.charAt(slot.length - 1) + " / " + startTime + ' - ' + endTime
      const classStatus = status === 'past' ? 'Past' : (status === 'current' ? 'On going' : 'Future');

      setClassInfo([
        { label: 'Class', value: classCode },
        { label: 'Subject', value: subjectCode },
        { label: 'Date', value: date },
        { label: 'Room', value: room },
        { label: 'Slot / time', value: slotTime },
        { label: 'Class status', value: classStatus },
      ])

    } catch (error) {
      toast.error('Error occure when handling the data, please try again later')
    }
  }, [])

  return (
    <Content className={styles.content}>
      <Space className={styles.classDetailsHeader}>
        <Space direction="vertical">
          <Typography.Title level={3}>Class</Typography.Title>
          <Space direction="horizontal" style={{ marginBottom: 15 }}>
            <text>Home / </text>
            <text className={styles.textClass}>Class / {subjectCode}_Room.{room}</text>
          </Space>
        </Space>

        <Space>
          <Button className={styles.btnFap}>
            <Space direction='horizontal'>
              <Typography.Text className={styles.btnText}>Check on FAP</Typography.Text>
              <hr className={styles.hrLine}></hr>
              <img className={styles.fptLogo} style={{ width: 60, height: 40 }} src={fptimg} alt='fpt logo' />
            </Space>
          </Button>
        </Space>
      </Space>


      {/* <ClassDetail /> */}
      <Row className={styles.classDetailHeader} gutter={[16, 16]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={8}
          className={styles.cardParent1}
        >
          <Card className={styles.card1}>
            <div style={{ marginBottom: 30 }}>
              <div className={styles.detailsHeader}>Details</div>
            </div>
            {classInfo.map((detail) => (
              <div>
                <hr
                  style={{
                    borderColor: '#e6e7e9',
                    borderWidth: 0.5,
                  }}
                />

                <Row className={styles.rowDetails}>
                  <Col span={10}>
                    <div>{detail.label}</div>
                  </Col>
                  <Col>
                    {detail.label === 'Class status' ? (
                      <div className={checkingStatus(detail.value)} style={{ fontWeight: 500 }}>
                        {detail.value}
                      </div>
                    ) : (
                      <div style={{ fontWeight: 500, color: '#667085' }}>
                        {detail.value}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={16}
          className={styles.cardParent2}
        >
          <Card className={styles.card2}>
            <Row>
              <Col
                span={11}
                style={{
                  marginRight: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Row className={styles.btnGroup} gutter={[16, 16]}>
                  <Col
                    xs={240}
                    sm={120}
                    md={120}
                    lg={120}
                    xl={120}
                    style={{ marginBottom: '8px' }}
                  >
                    <Button style={{ height: '100%', width: '100%' }}>
                      <Row>
                        <Col
                          span={20}
                          style={{ paddingLeft: 0, paddingRight: 80 }}
                        >
                          <Row>
                            <text style={{ fontWeight: 500, fontSize: 20 }}>
                              FINGERPRINT
                            </text>
                          </Row>
                          <Row>
                            <text
                              style={{
                                fontWeight: 500,
                                color: '#339ffe',
                                fontSize: 25,
                              }}
                            >
                              Import templates
                            </text>
                          </Row>
                        </Col>
                        <hr />
                        <Col
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyItems: 'center',
                            paddingLeft: 15,
                          }}
                        >
                          <IoIosFingerPrint style={{ fontSize: '30px' }} />
                        </Col>
                      </Row>
                    </Button>
                  </Col>
                  <Col
                    xs={240}
                    sm={120}
                    md={120}
                    lg={120}
                    xl={120}
                    style={{ marginBottom: '8px' }}
                  >
                    <Button style={{ height: '100%', width: '100%' }}>
                      <Row>
                        <Col
                          span={20}
                          style={{ paddingLeft: 0, paddingRight: 80 }}
                        >
                          <Row>
                            <text style={{ fontWeight: 500, fontSize: 20 }}>
                              FINGERPRINT
                            </text>
                          </Row>
                          <Row>
                            <text
                              style={{
                                fontWeight: 500,
                                color: '#339ffe',
                                fontSize: 25,
                              }}
                            >
                              Import templates
                            </text>
                          </Row>
                        </Col>
                        <hr />
                        <Col
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyItems: 'center',
                            paddingLeft: 20,
                            paddingRight: 5,
                          }}
                        >
                          <VscChecklist style={{ fontSize: '20px' }} />
                        </Col>
                      </Row>
                    </Button>
                  </Col>
                </Row>
              </Col>

              <hr className={styles.hrVertical}></hr>
              <Col span={12} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                  <text className={styles.moduleText}>Modules</text>
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 15,
                  }}
                >
                  <Button className={styles.btnConnect}>
                    <text>Connect</text>
                  </Button>
                  <Button className={styles.btnDisconnect}>
                    <text>Disconnect</text>
                  </Button>
                </Col>
                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                  <Card>
                    <Row>
                      <Col
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 5,
                          marginLeft: -10,
                        }}
                      >
                        <img src={module} alt="module" />
                      </Col>
                      <Col
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <text className={styles.moduleDetail}>
                          ID:{' '}
                          <span className={styles.moduleDetails}>M1_khoald</span>
                        </text>
                        <br />
                        <text className={styles.moduleDetail}>
                          Status:{' '}
                          <span className={styles.moduleDetails}>
                            Not connected
                          </span>
                        </text>
                        <br />
                        <text className={styles.moduleDetail}>
                          Received date:{' '}
                          <span className={styles.moduleDetails}>24/02/2022</span>
                        </text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Col>
            </Row>
          </Card>
        </Col>

        <ClassDetailTable scheduleID={scheduleID} />

      </Row>
    </Content>
  );
};

export default ClassDetails;
