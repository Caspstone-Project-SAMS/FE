import {
    Card,
    Col,
    Layout,
    Row,
  } from 'antd';
  import { Content } from 'antd/es/layout/layout';
  import React, { useState, useEffect } from 'react';
  import styles from './Slot.module.less';
  import { useLocation } from 'react-router-dom';
  import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
  import type { SlotDetail } from '../../../models/slot/Slot';
  import { SlotService } from '../../../hooks/Slot';
  const { Header: AntHeader } = Layout;
  
  const SlotDetail: React.FC = () => {
    const location = useLocation();
    const [slot, setSlot] = useState<SlotDetail>();
    const [slotID, setSlotID] = useState<number>(0);
  
      console.log("slot", slot)
  
    const slotDetails = [
      { title: 'Slot ID', value: slot?.result.slotID },
      { title: 'Slot Number', value: slot?.result.slotNumber },
      {
        title: 'Status',
        value: slot?.result.status ? 'active' : 'inactive',
        isAuthenticated: true,
      },
      { title: 'Order', value: slot?.result.order },
      { title: 'Start Time', value: slot?.result.startTime },
      { title: 'End Time', value: slot?.result.endtime },
    ];
  
    useEffect(() => {
      if (location.state && location.state.slotID) {
        setSlotID(location.state.slotID);
      }
    }, [location.state]);
  
    useEffect(() => {
      if (slotID !== 0) {
        const response = SlotService.getSlotByID(slotID);
  
        response
          .then((data) => {
            setSlot(data || undefined);
          })
          .catch((error) => {
            console.log('get slot by id error: ', error);
          });
      }
    }, [slotID]);
  
  
  
    return (
      <Content className={styles.slotContent}>
        <ContentHeader
          contentTitle="Slot"
          previousBreadcrumb={'Home / Slot / '}
          currentBreadcrumb={'Slot Detail'}
          key={''}
        />
        <Card className={styles.cardHeaderDetail}>
          <Row gutter={[16, 16]}>
            <Col span={14}>

            </Col>
            <Col span={10}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Slot Details</p>
                </AntHeader>
  
                <Col span={24}>
                  <Content>
                    <Content>
                      <table className={styles.slotDetailsTable}>
                        <tbody>
                          {slotDetails.map((detail, index) => (
                            <tr key={index}>
                              <td className={styles.updateSlotTitle}>
                                {detail.title}
                              </td>
                              <td>
                                <p
                                  style={{
                                    color: detail.isAuthenticated
                                      ? detail.value === 'true'
                                        ? 'green'
                                        : 'red'
                                      : 'inherit',
                                  }}
                                >
                                  {detail.value}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Content>
                  </Content>
                </Col>
              </Content>
            </Col>
          </Row>
        </Card>
      </Content>
    );
  };
  
  export default SlotDetail;
  