import React, { useCallback, useEffect, useState } from 'react';
import { Content, Header } from 'antd/es/layout/layout';
import { Card, Col, Row, Select, Space, Typography } from 'antd';
import styles from './System.module.less';
import { System } from '../../models/system/System';

interface SystemComponentProps {
  systemConfig: System | undefined;
}
const SystemComponent: React.FC<SystemComponentProps> = ({ systemConfig }) => {
  const systemDetails = [
    { label: 'System Configuration', value: systemConfig?.result.systemConfigurationId },
    { label: 'Revertable Duration In Hours', value: systemConfig?.result.revertableDurationInHours },
    { label: 'Class Code Match Rate', value: systemConfig?.result.classCodeMatchRate },
    { label: 'Semester Duration In Days', value: systemConfig?.result.semesterDurationInDays },
    { label: 'Slot Duration In Mins', value: systemConfig?.result.semesterDurationInDays },
  ];
  return (
    <Content className={styles.homeSystemCtn}>
      <Card className={styles.card1}>
        <div style={{ marginBottom: 30 }}>
          <div className={styles.detailsHeader}>System Details</div>
        </div>
        {systemDetails.map((system, i) => (
          <div key={`info_${i}`}>
            <hr
              style={{
                borderColor: '#e6e7e9',
                borderWidth: 0.5,
              }}
            />

            <Row className={styles.rowDetails}>
              <Col span={10}>
                <div>{system.label}</div>
              </Col>
              <Col>
                {system.label === 'Class status' ? (
                  <div
                    // className={checkingStatus(detail.value)}
                    style={{ fontWeight: 500 }}
                  >
                    {system.value}
                  </div>
                ) : (
                  <div style={{ fontWeight: 500, color: '#667085' }}>
                    {system.value}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        ))}
      </Card>
    </Content>
  );
};

export default SystemComponent;
