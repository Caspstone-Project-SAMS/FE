import { Button, Card, Layout, Row, Table } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
// import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import styles from './AccountTeachers.module.less';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { Employee, EmployeeDetail } from '../../../../models/employee/Employee';
import { useNavigate } from 'react-router-dom';
import { EmployeeService } from '../../../../hooks/Employee';
import { IoMdInformation } from 'react-icons/io';
import userIcon from '../../../../assets/imgs/users.png';

const { Header: AntHeader } = Layout;

const AccountTeachers: React.FC = () => {
  const [lecturer, setLecturer] = useState<EmployeeDetail[]>([]);
  const navigate = useNavigate();

  const handleRowClick = (lecturerID: number) => {
    navigate(`/teacher/teacher-detail`, {
      state: { lecturerID: lecturerID },
    });
  };

  const columns = [
    {
      key: '1',
      title: 'Lecturer Name',
      dataIndex: 'lecturername',
    },
    {
      key: '2',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: '3',
      title: 'Department',
      dataIndex: 'department',
    },
    // {
    //   key: '4',
    //   title: 'Birthday',
    //   dataIndex: 'birthday',
    // },
    {
      key: '4',
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      key: '5',
      title: 'Info',
      dataIndex: 'info',
      render: (lecturerID: number) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(lecturerID);
            }}
            shape="circle"
            style={{ border: 'none' }}
          >
            <span>
              <IoMdInformation size={25} />
            </span>
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const response = EmployeeService.getAllEmployee();

    response
      .then((data) => {
        setLecturer(data?.result || []);
        // setFilteredSlots(data || []);
      })
      .catch((error) => {
        console.log('get lecturer error: ', error);
      });
  }, []);
  return (
    <Content className={styles.accountTeacherContent}>
      <ContentHeader
        contentTitle="Teacher"
        previousBreadcrumb={'Home / Account / '}
        currentBreadcrumb={'Teacher'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Teachers</p>
            {/* <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name or code"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchStudent(e.target.value)}
                ></Input>
              </Col>
            </Row> */}
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={lecturer.map((item, index) => ({
          key: index,
          lecturername: (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                src={item.avatar || userIcon}
                alt="Teacher"
                className={styles.img}
              />
              <p className={styles.lecturerName}>{item.displayName}</p>
            </div>
          ),
          email: item.email,
          department: item.department,
          phone: item.phoneNumber,
          info: item.employeeID,
        }))}
        pagination={{
          showSizeChanger: true,
        }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record.slotID),
        // })}
      ></Table>
    </Content>
  );
};

export default AccountTeachers;
