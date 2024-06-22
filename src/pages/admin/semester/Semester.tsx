import { Card, Col, Input, Layout, Row, Table } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './Semester.module.less';
import type { Semester } from '../../../models/calendar/Semester';
import { CalendarService } from '../../../hooks/Calendar';
import { CiSearch } from 'react-icons/ci';

const { Header: AntHeader } = Layout;

const Semester: React.FC = () => {
  const [title] = useState('semester');
  const [semester, setSemester] = useState<Semester[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemester, setFilteredSemester] = useState<Semester[]>(semester);
  const [isUpdate, setIsUpdate] = useState(false);

  const columns = [
    {
      key: '1',
      title: 'Semester',
      dataIndex: 'semester',
    },
    {
      key: '2',
      title: 'Semester status',
      dataIndex: 'semesterstatus',
    },
    {
      key: '3',
      title: 'Start date',
      dataIndex: 'startdate',
    },
    {
      key: '4',
      title: 'End date',
      dataIndex: 'enddate',
    },
  ];
  useEffect(() => {
    const response = CalendarService.getAllSemester();

    response
      .then((data) => {
        setSemester(data || []);
        // setFilteredSemester(data || []);
      })
      .catch((error) => {
        console.log("get semester error: ", error)
      });
  }, []);

  console.log('aaaaa', semester);
  const handleSearchSemester = (value: string) => {
    setSearchInput(value);
    const filtered = semester.filter(
      (item) =>
        item.semesterCode &&
        item.semesterCode.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSemester(filtered);
    setIsUpdate(true);
  };

  return (
    <Content className={styles.accountSemesterContent}>
      <PageHeaderAdmin title={title} />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Semester</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchSemester(e.target.value)}
                ></Input>
              </Col>
            </Row>
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(!isUpdate ? semester : filteredSemester).map(
          (item, index) => ({
            key: index,
            semester: item.semesterCode,
            semesterstatus: (
              <div>
                <p style={{ color: item.semesterStatus ? 'green' : 'red' }}>
                  {item.semesterStatus ? 'true' : 'false'}
                </p>
              </div>
            ),
            startdate: item.startDate,
            enddate: item.endDate,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
    </Content>
  );
};

export default Semester;
