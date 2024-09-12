import {
  Card,
  Col,
  Divider,
  Input,
  Layout,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
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
import moment from 'moment';

const { Header: AntHeader } = Layout;

const AccountTeacherDetail: React.FC = () => {
  const location = useLocation();
  const [lecturer, setLecturer] = useState<EmployeeDetails>();
  const [lecturerClass, setLecturerClass] = useState<ManageClass[]>([]);
  const [lecturerModule, setLecturerModule] = useState<ManageModule[]>([]);
  const [lecturerID, setLecturerID] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredLecturerClass, setFilteredLecturerClass] =
    useState<ManageClass[]>(lecturerClass);

  const lecturerDetails = [
    { title: 'Name', value: lecturer?.result.displayName || 'N/A' },
    { title: 'Address', value: lecturer?.result.address || 'N/A' },
    {
      title: 'Birthday',
      value: (lecturer?.result.dob && moment(lecturer?.result.dob, 'YYYY-MM-DD').format('DD/MM/YYYY') || 'N/A'),
    },
    { title: 'Email', value: lecturer?.result.email || 'N/A' },
    { title: 'Phone', value: lecturer?.result.phoneNumber || 'N/A' },
    // { title: 'Department', value: lecturer?.result.department || 'N/A' },
  ];

  const columnsClass = [
    {
      key: '1',
      title: 'Class Code',
      dataIndex: 'classCode',
    },
    {
      key: '2',
      title: 'Status',
      dataIndex: 'classStatus',
      render: (classStatus: number) => (
        <div>
          <Tag
            color={classStatus === 1 ? 'green' : classStatus === 2 ? 'red' : 'gray'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {classStatus === 1 ? 'available' : classStatus === 2 ? 'unavailable' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '3',
      title: 'Semester',
      dataIndex: 'semester',
    },
    {
      key: '4',
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      key: '5',
      title: 'Room',
      dataIndex: 'room',
    },
  ];

  const columnsModule = [
    {
      key: '1',
      title: 'Module',
      dataIndex: 'moduleID',
    },
    {
      key: '2',
      title: 'Mode',
      dataIndex: 'mode',
      render: (mode: number) => (
        <div>
          <Tag
            color={mode === 1 ? 'green' : mode === 2 ? 'blue' : 'gray'}
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              textAlign: 'center',
            }}
          >
            {mode === 1 ? 'Register' : mode === 2 ? 'Attendance' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '4',
      title: 'Status',
      dataIndex: 'moduleStatus',
      render: (moduleStatus: number) => (
        <div>
          <Tag
            color={moduleStatus === 1 ? 'green' : moduleStatus === 2 ? 'red' : 'gray'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {moduleStatus === 1 ? 'available' : moduleStatus === 2 ? 'unavailable' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '5',
      title: 'Auto Prepare',
      dataIndex: 'autoPrepare',
      render: (autoPrepare: boolean) => (
        <div>
          <Tag
            color={autoPrepare === true ? 'green' : autoPrepare === false ? 'red' : 'gray'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {autoPrepare === true ? 'Auto' : autoPrepare === false ? 'Not Auto' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '6',
      title: 'Prepared Time',
      dataIndex: 'preparedTime',
    },
    // {
    //   key: '7',
    //   title: 'Auto Reset',
    //   dataIndex: 'autoReset',
    //   render: (autoReset: boolean) => (
    //     <div>
    //       <Tag
    //         color={autoReset ? 'green' : 'red'}
    //         style={{ fontWeight: 'bold', fontSize: '10px' }}
    //       >
    //         {autoReset ? 'Auto' : 'Not Auto'}
    //       </Tag>
    //     </div>
    //   ),
    // },
  ];

  useEffect(() => {
    if (location.state && location.state.lecturerID) {
      setLecturerID(location.state.lecturerID);
    }
  }, [location.state]);

  console.log('lecturer', lecturer);

  useEffect(() => {
    if (lecturerID !== '') {
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

  // const handleSearchClass = (value: string) => {
  //   setSearchInput(value);
  //   const filtered = lecturerClass.filter(
  //     (item) =>
  //       item.classCode &&
  //       item.classCode.toLowerCase().includes(value.toLowerCase()),
  //   );
  //   setFilteredLecturerClass(filtered ?? []);
  //   setIsUpdate(true);
  // };

  const handleSearchClass = (value: string) => {
    setSearchInput(value);

    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const normalizedValue = normalizeString(value).toLowerCase();
    const filtered = lecturerClass.filter(
      (item) =>
        item.classCode &&
        normalizeString(item.classCode).toLowerCase().includes(normalizedValue),
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
              {/* <Col span={24}>
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
              </Col> */}
              <Col span={24}>
                <Card className={styles.card1}>
                  {lecturerDetails.map((detail, i) => (
                    <div key={`info_${i}`}>
                      <Row className={styles.rowDetails}>
                        <Col span={8}>
                          <div style={{ fontWeight: 500 }}>{detail.title}</div>
                        </Col>
                        <Col span={16}>
                          <div style={{ fontWeight: 500, color: '#667085' }}>
                            {detail.value}
                          </div>
                        </Col>
                      </Row>
                      <hr
                        style={{
                          borderColor: '#e6e7e9',
                          borderWidth: 0.5,
                        }}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Content>
          </Col>
        </Row>
        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        >
          Classes
        </Divider>
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
                classCode: item.classCode || 'N/A',
                classStatus: item.classStatus,
                semester: item.semesterCode || 'N/A',
                subject: item.subjectCode || 'N/A',
                room: item.roomName || 'N/A',
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
                moduleID: item.moduleID || 'N/A',
                mode: item.mode,
                moduleStatus: item.status,
                autoPrepare: item.autoPrepare,
                preparedTime: (typeof item.preparedTime === 'string'
                  ? item.preparedTime
                  : String(item.preparedTime ?? 'N/A')
                ).slice(0, 5),
                // autoReset: item.autoReset,
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
