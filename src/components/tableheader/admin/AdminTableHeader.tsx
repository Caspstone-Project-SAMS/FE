import React from 'react';
import styles from './AdminTableHeader.module.less';
import { Card, Col, Input, Layout, Row, Select, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { CiSearch } from 'react-icons/ci';
import { IoMdArrowDropdown } from 'react-icons/io';
import { CiCalendar } from 'react-icons/ci';

const { Header: AntHeader } = Layout;

const AdminTableHeader: React.FC = () => {
  return (
    <Card>
      <Content>
        <AntHeader className={styles.tableHeader}>
          <p className={styles.tableTitle}>Students</p>
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                placeholder="Search by name or role"
                suffix={<CiSearch />}
                variant="filled"
              ></Input>
            </Col>
            <Col>
              <Input
                prefix={<CiCalendar />}
                suffix={<IoMdArrowDropdown />}
                variant="filled"
              ></Input>
            </Col>
          </Row>
        </AntHeader>
      </Content>
    </Card>
  );
};

export default AdminTableHeader;
