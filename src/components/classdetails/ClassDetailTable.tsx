import styles from './ClassDetail.module.less';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Layout, Table, Typography, Skeleton, Avatar, Image } from 'antd';
import Search from 'antd/es/input/Search';
import { Content } from 'antd/es/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { IoIosCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { LiaFingerprintSolid } from 'react-icons/lia';

import DetailClassTable from './data/DetailClassTable';
import { AttendanceService } from '../../hooks/Attendance';
import { ClassDetail } from '../../models/ClassDetail';
import { Attendance } from '../../models/attendance/Attendance';

const { Header: AntHeader } = Layout;

type props = {
  scheduleID: string
}

const attendanceStatus = {
  0: 'Not yet',
  1: 'Attended',
  2: 'Absent'
}

const ClassDetailTable: React.FC<props> = ({ scheduleID }) => {
  const [studentList, setStudentList] = useState<Attendance[]>([])
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const [pageSize, setPageSize] = useState<number>(15);
  const [dataSource] = useState<ClassDetail[]>(DetailClassTable());
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      key: '1',
      title: 'Student name',
      render: ((record: Attendance) => {
        return (
          <div>
            <Avatar src={
              <Image
                // width={300}
                src={record.avatar ? record.avatar : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'}
              />}
            />
            {record.studentName}
          </div>
        )
      }),
    },
    {
      key: '2',
      title: 'Student code',
      dataIndex: 'studentCode',
    },
    {
      key: '3',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: '4',
      title: 'Status',
      dataIndex: 'attendanceStatus',
      render: (statusIndex: number) => (
        <span
          style={{
            color:
              statusIndex === 0
                ? '#fbbf24'
                : statusIndex === 1
                  ? 'green'
                  : 'red',
          }}
        >
          {statusIndex === 0 ? 'Not yet' : (statusIndex === 1 ? 'Attended' : 'Absent')}
        </span>
      ),
      // filters: [
      //   {
      //     text: 'Not yet',
      //     value: 0,
      //   },
      //   {
      //     text: 'Attended',
      //     value: 1,
      //   },
      //   {
      //     text: 'Absent',
      //     value: 2,
      //   },
      // ],
      // onFilter: (value, record) => record.statusIndex.indexOf(value) === 0,
    },
    {
      key: '5',
      title: 'Fingerprint status',
      dataIndex: 'isAuthenticated',
      render: (isAuthenticated: boolean) => (
        <span style={{ color: isAuthenticated ? 'green' : 'red' }}>
          {isAuthenticated ? (
            <IoIosCheckmark style={{ fontSize: '30px' }} />
          ) : (
            <RxCross2 style={{ color: 'red', fontSize: '24px' }} />
          )}
        </span>
      ),
      filters: [
        {
          text: 'Authenticated',
          value: true,
        },
        {
          text: 'Unauthenticated',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isAuthenticated === value,
    },
    {
      key: '6',
      title: 'Check attendance',
      render: (record: ClassDetail) => {
        return (
          <>
            <LiaFingerprintSolid style={{ fontSize: '24px' }} />
          </>
        );
      },
    },
    {
      key: '7',
      title: 'Comment',
      render: (record: ClassDetail) => {
        return (
          <>
            {record.fingerprintstatus === 'unauthenticated' && <EditOutlined />}
          </>
        );
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  useEffect(() => {
    console.log("scheduleID ", scheduleID);
    const response = AttendanceService.getAttendanceByScheduleID(scheduleID);
    setLoadingState(true);
    response.then(data => {
      setLoadingState(false);
      setStudentList(data);
      console.log("data attendance ", data);
    }).catch(err => {
      toast.error('Error at get student attendance info')
      setLoadingState(false)
      console.log(err);
    })
  }, [])

  return (
    <Content className={styles.classDetailContent}>

      <AntHeader className={styles.classDetailHeader}>
        <Typography.Title level={3} style={{ marginTop: 5 }}>
          Student
        </Typography.Title>
        <Search
          placeholder="input search text"
          allowClear
          style={{
            width: 200,
            display: 'flex',
          }}
        />
      </AntHeader>
      <Table
        columns={columns}
        dataSource={studentList}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: handlePageSizeChange,
          pageSizeOptions: ['5', '15', '35'],
          className: 'pagination-center',
        }}
        showSorterTooltip={{
          target: 'sorter-icon',
        }}
      // rowSelection={rowSelection}
      ></Table>
    </Content>
  );
};

export default ClassDetailTable;
