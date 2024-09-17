import React from 'react';
import { Content, Header } from 'antd/es/layout/layout';
import { CalendarOutlined } from '@ant-design/icons';
import { Select, Space, Typography } from 'antd';
import ContentHeader from '../header/contentHeader/ContentHeader';
import styles from './HomeCalendar.module.less';

const ImportScheduleRecord: React.FC = () => {
  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <Content className={styles.homeCalendarCtn}>
      <div className={styles.header}>
        <ContentHeader
          contentTitle="Calendar"
          previousBreadcrumb={"Calendar / "}
          currentBreadcrumb={"Import Schedule Record"}
        />
      </div>
    </Content>
  );
};

export default ImportScheduleRecord;
