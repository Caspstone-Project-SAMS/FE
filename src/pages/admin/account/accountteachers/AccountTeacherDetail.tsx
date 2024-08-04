import { Card, Col, Input, Layout, Row, Space, Table, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import personIcon from '../../../../assets/imgs/person-icon.jpg';
// import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import styles from './AccountTeachers.module.less';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { useLocation } from 'react-router-dom';
import {
  Employee,
  EmployeeDetails,
  ManageClass,
  ManageModule,
} from '../../../../models/employee/Employee';
import { EmployeeService } from '../../../../hooks/Employee';
import { CiSearch } from 'react-icons/ci';

const { Header: AntHeader } = Layout;

const AccountTeacherDetail: React.FC = () => {
  const location = useLocation();
  const [lecturer, setLecturer] = useState<EmployeeDetails>();
  const [lecturerClass, setLecturerClass] = useState<ManageClass[]>([]);
  const [lecturerModule, setLecturerModule] = useState<ManageModule[]>([]);
  const [lecturerID, setLecturerID] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredLecturerClass, setFilteredLecturerClass] =
    useState<ManageClass[]>(lecturerClass);

  const lecturerDetails = [
    { title: 'Name', value: lecturer?.result.displayName },
    { title: 'Address', value: lecturer?.result.address },
    { title: 'Birthday', value: lecturer?.result.dob },
    { title: 'Email', value: lecturer?.result.email },
    { title: 'Phone', value: lecturer?.result.phoneNumber },
    { title: 'Department', value: lecturer?.result.department },
  ];

  const columnsClass = [
    {
      key: '1',
      title: 'Class ID',
      dataIndex: 'classID',
    },
    {
      key: '2',
      title: 'Class Code',
      dataIndex: 'classCode',
    },
    {
      key: '4',
      title: 'Status',
      dataIndex: 'classStatus',
      render: (classStatus: boolean) => (
        <div>
          <p style={{ color: classStatus ? 'green' : 'red' }}>
            {classStatus ? 'active' : 'inactive'}
          </p>
        </div>
      ),
    },
    {
      key: '5',
      title: 'Slot',
      dataIndex: 'slot',
    },
  ];

  const columnsModule = [
    {
      key: '1',
      title: 'Module ID',
      dataIndex: 'moduleID',
    },
    {
      key: '2',
      title: 'Mode',
      dataIndex: 'mode',
    },
    {
      key: '4',
      title: 'Status',
      dataIndex: 'moduleStatus',
      render: (moduleStatus: boolean) => (
        <div>
          <p style={{ color: moduleStatus ? 'green' : 'red' }}>
            {moduleStatus ? 'active' : 'inactive'}
          </p>
        </div>
      ),
    },
    {
      key: '5',
      title: 'Auto Prepare',
      dataIndex: 'autoPrepare',
      render: (autoPrepare: boolean) => (
        <div>
          <p style={{ color: autoPrepare ? 'green' : 'red' }}>
            {autoPrepare ? 'Auto' : 'Not auto'}
          </p>
        </div>
      ),
    },
    {
      key: '6',
      title: 'Prepared Time',
      dataIndex: 'preparedTime',
    },
    {
      key: '7',
      title: 'Auto Reset',
      dataIndex: 'autoReset',
      render: (autoReset: boolean) => (
        <div>
          <p style={{ color: autoReset ? 'green' : 'red' }}>
            {autoReset ? 'Auto' : 'Not auto'}
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (location.state && location.state.lecturerID) {
      setLecturerID(location.state.lecturerID);
    }
  }, [location.state]);

  console.log('lecturer', lecturer);

  useEffect(() => {
    if (lecturerID !== 0) {
      const response = EmployeeService.getEmployeeByID(lecturerID);

      response
        .then((data) => {
          setLecturer(data || undefined);
          setLecturerClass(data?.result.managedClasses || []);
          setLecturerModule(data?.result.modules || []);
          setFilteredLecturerClass(data?.result.managedClasses || []);
        })
        .catch((error) => {
          console.log('get employee by id error: ', error);
        });
    }
  }, [lecturerID]);

  const handleSearchClass = (value: string) => {
    setSearchInput(value);
    const filtered = lecturerClass.filter(
      (item) =>
        item.classCode &&
        item.classCode.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredLecturerClass(filtered ?? []);
    setIsUpdate(true);
  };

  return (
    <Content className={styles.accountTeacherContent}>
      <ContentHeader
        contentTitle="Teacher"
        previousBreadcrumb={'Home / Account / Teacher / '}
        currentBreadcrumb={'Teacher Detail'}
        key={''}
      />
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={9}>
            <Card style={{ height: '100%' }}>
              <img
                src={lecturer?.result.avatar || personIcon}
                alt="Student"
                className={styles.studentImg}
              />
            </Card>
          </Col>
          <Col span={15}>
            <Content>
              <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Teacher Details</p>
              </AntHeader>
              <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.lecturerDetailsTable}>
                      <tbody>
                        {lecturerDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.lecturerTitle}>
                              {detail.title}
                            </td>
                            <td>
                              <p>{detail.value}</p>
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
        <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Classes</p>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Input
                        placeholder="Search "
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
              columns={columnsClass}
              dataSource={(!isUpdate
                ? lecturerClass
                : filteredLecturerClass
              ).map((item, index) => ({
                key: index,
                classID: item.classID,
                classCode: item.classCode,
                classStatus: item.classStatus,
              }))}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Modules</p>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columnsModule}
              dataSource={lecturerModule.map((item, index) => ({
                key: index,
                moduleID: item.moduleID,
                mode: item.mode,
                moduleStatus: item.status,
                autoPrepare: item.autoPrepare,
                preparedTime: item.preparedTime,
                autoReset: item.autoReset,
              }))}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default AccountTeacherDetail;
