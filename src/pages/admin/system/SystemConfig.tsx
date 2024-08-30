import React, { useCallback, useEffect, useState } from 'react';
import { Content, Header } from 'antd/es/layout/layout';
import { Card, Select, Space, Typography } from 'antd';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import styles from './System.module.less';
import { System } from '../../../models/system/System';
import { SystemService } from '../../../hooks/System';
import SystemComponent from '../../../components/system/SystemComponent';

const SystemConfig: React.FC = () => {


  return (
    <Content className={styles.homeSystemCtn}>
      <div className={styles.header}>
        <ContentHeader
          contentTitle="System"
          previousBreadcrumb={'Home / '}
          currentBreadcrumb={'System Configuration'}
        />
      </div>
      <Card className={styles.cardHeader}>
        <SystemComponent />
      </Card>
    </Content>
  );
};

export default SystemConfig;
