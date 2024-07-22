import styles from '../Class.module.less';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import { Button, Card, Col, Row, Space, Typography } from 'antd';

import module from '../../../assets/imgs/module.png'
import fingerprintIcon from '../../../assets/icons/fingerprint.png'
import reportIcon from '../../../assets/icons/Report.png'
import fptimg from '../../../assets/imgs/FPT-Logo-PNG.png'

import ClassDetailTable from '../../../components/classdetails/ClassDetailTable';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import BtnDecoration from '../../../components/global/BtnDecoration';
import { HelperService } from '../../../hooks/helpers/helperFunc';

const ClassDetails: React.FC = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const { scheduleID, classCode, room, slot, start, end, status, subjectCode } = event || {}

  const [classInfo, setClassInfo] = useState<{ label: string, value: string }[]>([]);

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
      console.log("ScheduleID ", scheduleID);

      const date = start.getDate() + '/' + (start.getMonth() + 1) + '/' + start.getFullYear();
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
        <ContentHeader
          contentTitle='Class'
          previousBreadcrumb='Home / Class / '
          currentBreadcrumb={`${subjectCode}_Room.${room}`}
          key={'class-details-header'}
        />

        <Space>
          <Button
            onClick={() => HelperService.navigateFAP()}
            className={styles.btnFap}>
            <Space direction='horizontal'>
              <Typography.Text className={styles.btnText} >Check on FAP</Typography.Text>
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
            {classInfo.map((detail, i) => (
              <div key={`info_${i}`}>
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
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Col span={11}>
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
                  <div className={styles.moduleCard}>
                    <div className={styles.moduleImgCtn}>
                      <img src={module} alt='Module image' className={styles.moduleImg} />
                    </div>
                    <div className={styles.moduleInfo}>
                      <span>
                        <b>ID: </b>M1_khoald
                      </span>
                      <span>
                        <b>Status: </b>Not connected
                      </span>
                      <span>
                        <b>ID: </b>24/02/2022
                      </span>
                    </div>
                  </div>
                </Col>
              </Col>

              <hr className={styles.hrVertical} />

              <Col
                span={10}
                style={{
                  marginRight: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Row className={styles.btnGroup}>
                  <div style={{ marginBottom: '10px', width: '100%' }}>
                    <BtnDecoration btnFuncName='Import templates' btnTitle='Fingerprint' imgDecor={fingerprintIcon} key={'fingerprintImport'} />
                  </div>
                  <BtnDecoration btnFuncName='Start session' btnTitle='Attendance' imgDecor={reportIcon} key={'fingerprintImport'} />
                </Row>
              </Col>

            </Row>
          </Card>
        </Col>

        <ClassDetailTable scheduleID={scheduleID} />

      </Row>
    </Content >
  );
};

export default ClassDetails;
