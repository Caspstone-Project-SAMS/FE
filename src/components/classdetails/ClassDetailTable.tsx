import styles from './ClassDetail.module.less';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Layout, Table, Typography, Skeleton, Avatar, Image, Button, Radio, Input } from 'antd';
import Search from 'antd/es/input/Search';
import { Content } from 'antd/es/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { IoIosCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { LiaFingerprintSolid } from 'react-icons/lia';
import { BiCalendarEdit } from "react-icons/bi";

import DetailClassTable from './data/DetailClassTable';
import { AttendanceService } from '../../hooks/Attendance';
import { ClassDetail } from '../../models/ClassDetail';
import { Attendance } from '../../models/attendance/Attendance';
import type { TableProps } from 'antd';

const { Header: AntHeader } = Layout;

type props = {
  scheduleID: string
}
let socket

const attendanceStatus = {
  0: 'Not yet',
  1: 'Attended',
  2: 'Absent'
}
type ColumnsType<T> = TableProps<T>['columns'];

const ClassDetailTable: React.FC<props> = ({ scheduleID }) => {

  //web socket
  const [information, setInformation] = useState("Ready to connect");
  const [change, setChange] = useState('any');
  const [close, setClose] = useState(false);

  //student table
  const [studentList, setStudentList] = useState<Attendance[]>([])
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const [dataSource] = useState<ClassDetail[]>(DetailClassTable());
  const [pageSize, setPageSize] = useState<number>(15);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isUpdate, setIsUpdate] = useState(true);


  const toggleUpdateAttendance = () => {
    setIsUpdate(!isUpdate);
  };

  function activeWebSocket() {
    socket = new WebSocket("http://35.221.168.89/ws");
    socket.onopen = function (event) {
      console.log('Connecteed');
      // setInformation("Connected");
    };

    socket.onclose = function (event) {
      console.log("Connection closed");
      console.log(event);
    };

    socket.onmessage = function (event) {
      console.log("env--------", event);
      console.log("env.data", event.data);
      const message = JSON.parse(event.data);
      console.log("mess message event*", message.Event);
      console.log("mess message Data*", message.Data);
      switch (message.Event) {
        case "statusChange":
          {
            const data = JSON.parse(message.Data);
            console.log("case status change", data.studentID, data.status)
            // console.log(typeof (message.data));
            // console.log("mess data ", message.data);

            const elementId = `attendanceStatus-${data.studentID}`;
            const element = document.getElementById(`attendanceStatus-${data.studentID}`);

            if (element) {
              element.innerHTML = 'Attended'
              element.style.color = 'green'
            }

            const newOne = studentList.map(item => {
              if (item.studentID == data.studentID) {
                item.attendanceStatus = data.status
                return item
              }
              return item
            })
            console.log("The prev one ", studentList);
            console.log("The Edited one ", newOne);
          }
          break;
      }
    };
  }

  const columns: ColumnsType<Attendance> = [
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
      // dataIndex: 'attendanceStatus',
      render: (record: Attendance) => (
        <span
          id={`attendanceStatus-${record.studentID}`}
          style={{
            color:
              record.attendanceStatus === 0
                ? '#fbbf24'
                : record.attendanceStatus === 1
                  ? 'green'
                  : 'red',
          }}
        >
          {record.attendanceStatus === 0 ? 'Not yet' : (record.attendanceStatus === 1 ? 'Attended' : 'Absent')}
        </span>
      ),
      filters: [
        {
          text: 'Not yet',
          value: 0,
        },
        {
          text: 'Attended',
          value: 1,
        },
        {
          text: 'Absent',
          value: 2,
        },
      ],
      onFilter: (value, record) => record.attendanceStatus === value,
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
      width: '5%'
    },
    {
      key: '6',
      title: 'Check attendance',
      render: (text, record: Attendance, index: number) => {
        return (
          <>
            <Radio.Group key={`radio_${index}`} name="radiogroup" defaultValue={1}>
              <Radio value={1}>Attended</Radio>
              <Radio value={2}>Absent</Radio>
            </Radio.Group>
          </>
        );
      },
    },
    {
      key: '7',
      title: 'Comment',
      render: (text, record: Attendance, index: number) => {
        return (
          <>
            <Input key={`cmt-${index}`} name='comment' />
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
    console.log("Change in detrail ", change);
  }, [change])

  useEffect(() => {
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

  useEffect(() => {
    activeWebSocket();

    return () => {
      socket.close();
    };
  }, [])

  return (
    <Content className={styles.classDetailContent}>
      <AntHeader className={styles.classDetailHeader}>
        <Typography.Title level={3} style={{ marginTop: 5 }}>
          Student
        </Typography.Title>
        <div className={styles.studentTableCtn}>
          <Search
            placeholder="Search by name or student code"
            allowClear
            style={{
              width: 200,
              display: 'flex',
            }}
            onChange={() => console.log("StudentList ", studentList)}
            onSearch={() => {
              console.log("close here");
              socket.close()
            }}
          />
          <Button
            onClick={() => toggleUpdateAttendance()}
            type={isUpdate ? 'primary' : 'dashed'}
            shape="default"
            icon={<BiCalendarEdit />}
          />
        </div>
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
