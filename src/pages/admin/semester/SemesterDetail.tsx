import {
  Card,
  Col,
  Input,
  Layout,
  Row,
  Table,
  Tag,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import styles from './Semester.module.less';
import { SemesterService } from '../../../hooks/Semester';
import type {
  SemesterClass,
  SemesterDetail,
} from '../../../models/calendar/Semester';
import { useLocation } from 'react-router-dom';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { CiSearch } from 'react-icons/ci';
import moment from 'moment';
const { Header: AntHeader } = Layout;

const SemesterDetail: React.FC = () => {
  const location = useLocation();
  const [semesterClass, setSemesterClass] = useState<SemesterClass[]>([]);
  const [semester, setSemester] = useState<SemesterDetail>();
  const [semesterID, setSemesterID] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemesterClass, setFilteredSemesterClass] =
    useState<SemesterClass[]>(semesterClass);

  const semesterDetails = [
    { title: 'Semester Code', value: semester?.result.semesterCode },
    {
      title: 'Status',
      value: semester?.result.semesterStatus ===1 ? (
        <Tag color="gray">Not Yet</Tag>
      ) : semester?.result.semesterStatus === 2 ? (
        <Tag color="blue">Ongoing</Tag>
      ) : semester?.result.semesterStatus === 3 ? (
        <Tag color="green">Finished</Tag>
      ) : 'Unknown',
      isAuthenticated: true,
    },
    { title: 'Start Date', value: moment(semester?.result.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY') },
    { title: 'End Date', value: moment(semester?.result.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY') },
  ];

  useEffect(() => {
    if (location.state && location.state.semesterID) {
      setSemesterID(location.state.semesterID);
    }
  }, [location.state]);

  useEffect(() => {
    if (semesterID !== 0) {
      const response = SemesterService.getSemesterByID(semesterID);

      response
        .then((data) => {
          setSemester(data || undefined);
          setSemesterClass(data?.result.classes || []);
          setFilteredSemesterClass(data?.result.classes || []);
        })
        .catch((error) => {
          console.log('get semester by id error: ', error);
        });
    }
  }, [semesterID]);

  const handleSearchClass = (value: string) => {
    setSearchInput(value);
    const filtered = semester?.result.classes.filter(
      (item) =>
        item.classCode &&
        item.classCode.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSemesterClass(filtered ?? []);
    setIsUpdate(true);
  };

  const columns = [
    {
      key: '1',
      title: 'Class Code',
      dataIndex: 'classCode',
    },
    {
      key: '2',
      title: 'status',
      dataIndex: 'classStatus',
      render: (classStatus: boolean) => (
        <div>
        <Tag 
          color={classStatus ? 'green' : 'red'} 
          style={{ fontWeight: 'bold', fontSize: '10px' }}
        >
          {classStatus ? 'active' : 'inactive'}
        </Tag>
      </div>
      ),
    },
  ];

  return (
    <Content className={styles.accountSemesterContent}>
      <ContentHeader
        contentTitle="Semester"
        previousBreadcrumb={'Home / Semester / '}
        currentBreadcrumb={'Semester Detail'}
        key={''}
      />
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Class</p>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Input
                        placeholder="Search by class code"
                        suffix={<CiSearch />}
                        variant="filled"
                        value={searchInput}
                        onChange={(e) => handleSearchClass(e.target.value)}
                      ></Input>
                    </Col>
                  </Row>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columns}
              dataSource={(!isUpdate ? semesterClass : filteredSemesterClass).map(
                (item, index) => ({
                  key: index,
                  classCode: item.classCode,
                  classStatus: item.classStatus,
                }),
              )}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
          <Col span={10}>
            <Content>
              <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Semester Details</p>
              </AntHeader>

              <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.semesterDetailsTable}>
                      <tbody>
                        {semesterDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.updateSemesterTitle}>
                              {detail.title}
                            </td>
                            <td>
                              <p>
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

export default SemesterDetail;
