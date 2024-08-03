import { Card, Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ClassDetail.module.less';
import ClassDetailTable from './ClassDetailTable';
import { IoIosFingerPrint } from 'react-icons/io';
import { VscChecklist } from 'react-icons/vsc';
import modules from '../../assets/imgs/module.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ModuleDetail } from '../../models/module/Module';
import { ModuleService } from '../../hooks/Module';

//code cu
const ClassDetail: React.FC = () => {
  const classDetails = [
    { label: 'Class', value: 'NJS1601' },
    { label: 'Subject', value: 'SEP240' },
    { label: 'Room', value: '404' },
    { label: 'Slot / time', value: '1 / 8:00 am - 9:00 am' },
  ];

  const [moduleDetail, setModuleDetail] = useState<ModuleDetail[]>([]);


  const employeeID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.employeeID,
  );

  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  console.log('module', moduleDetail)

  useEffect(() => {
    const response = ModuleService.getModuleByEmployeeID(employeeID ?? '');

    response
      .then((data) => {
        setModuleDetail(data?.result || []);
      })
      .catch((error) => {
        console.log('get module by id error: ', error);
      });
  }, [employeeID]);

  return (
    <Row className={styles.classDetailsHeader} gutter={[16, 16]}>
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
            <text className={styles.detailsHeader}>Details</text>
          </div>
          {classDetails.map((detail) => (
            <div>
              <hr
                style={{
                  borderColor: '#e6e7e9',
                  borderWidth: 0.5,
                }}
              />

              <Row className={styles.rowDetails}>
                <Col span={10}>
                  <text style={{ fontSize: 20 }}>{detail.label}</text>
                </Col>
                <Col>
                  <text style={{ fontWeight: 500, color: '#667085', fontSize: 20 }}>
                    {detail.value}
                  </text>
                </Col>
              </Row>
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <hr
              style={{
                borderColor: '#e6e7e9',
                borderWidth: 0.5,
              }}
            />

            <Row className={styles.rowDetails}>
              <Col span={10}>
                <text style={{ fontSize: 20 }} >Class status</text>
              </Col>
              <Col>
                <text style={{ color: 'green', fontWeight: 500, fontSize: 20 }}>
                  On going
                </text>
              </Col>
            </Row>
          </div>
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
                  <text style={{ fontWeight: 500, fontSize: 20 }}>Connect</text>
                </Button>
                <Button className={styles.btnDisconnect}>
                  <text style={{ fontWeight: 500, fontSize: 20 }}>Disconnect</text>
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
                      <img src={modules} alt="module" />
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

      <ClassDetailTable />

    </Row>
  );
};

export default ClassDetail;
