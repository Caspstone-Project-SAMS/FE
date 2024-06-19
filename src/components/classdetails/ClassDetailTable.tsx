import styles from './ClassDetail.module.less';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { RadioChangeEvent, TableProps } from 'antd';
import { Layout, Table, Typography, Skeleton, Avatar, Image, Button, Radio, Input, Tooltip } from 'antd';
import Search from 'antd/es/input/Search';
import { Content } from 'antd/es/layout/layout';
import { IoIosCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { BiCalendarEdit } from "react-icons/bi";


import { AttendanceService } from '../../hooks/Attendance';
import { Attendance, UpdateListAttendance } from '../../models/attendance/Attendance';

const { Header: AntHeader } = Layout;

type props = {
  scheduleID: string
}
type ColumnsType<T> = TableProps<T>['columns'];

let socket

const ClassDetailTable: React.FC<props> = ({ scheduleID }) => {

  //web socket
  const [change, setChange] = useState('any');
  const [close, setClose] = useState(false);

  //student table
  const [studentList, setStudentList] = useState<Attendance[]>([])
  const [updatedList, setUpdatedList] = useState<Attendance[]>([])

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(35);
  const [isUpdate, setIsUpdate] = useState(false);


  const toggleUpdateAttendance = () => {
    setIsUpdate(!isUpdate);
  };

  function activeWebSocket() {
    socket = new WebSocket("http://34.81.224.196/ws");
    socket.onopen = function (event) {
      console.log('Connecteed');
      // setInformation("Connected");
    };

    socket.onclose = function (event) {
      console.log("Connection closed");
      console.log(event);
    };

    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      console.log("mess message event*", message.Event);
      console.log("mess message Data*", message.Data);
      switch (message.Event) {
        case "statusChange":
          {
            const data = JSON.parse(message.Data);
            console.log("case status change", data.studentID, data.status)

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

  const handleRadioChange = (e: RadioChangeEvent, studentCode: string) => {
    setUpdatedList((studentList) =>
      studentList.map((item) =>
        item.studentCode === studentCode ? { ...item, attendanceStatus: e.target.value } : item
      )
    );
  };

  const handleCmtChange = (comment: string, studentCode: string) => {
    if (comment.length >= 1) {
      setUpdatedList((studentList) =>
        studentList.map((item) =>
          item.studentCode === studentCode ? { ...item, comments: comment } : item
        )
      );
    }
  };

  const handleSubmit = () => {
    const currentTime = new Date().toISOString()
    const fmtUpdatedList: UpdateListAttendance[] = updatedList.map(item => {
      const { comments, studentID, attendanceStatus } = item;
      if (studentID && attendanceStatus) {
        return {
          comments: comments,
          studentID: studentID,
          scheduleID: Number(scheduleID),
          attendanceTime: currentTime,
          attendanceStatus: attendanceStatus
        }
      }
    }).filter(item => item !== undefined);

    const response = AttendanceService.updateListAttendance(fmtUpdatedList);
    response.then(data => {
      setIsUpdate(false);
      setStudentList(updatedList)
      toast.success('Update Attendance Successfully!')
    }).catch(err => {
      toast.error('Something went wrong, please try again later');
    })
  }
  const handleCancel = () => {
    setIsUpdate(false)
    setUpdatedList(studentList);
  }
  const handleSearch = (value: string) => {
    const filtered = studentList.filter((item) =>
      item.studentCode!.toLowerCase().includes(value.toLowerCase()) ||
      item.studentName!.toLowerCase().includes(value.toLowerCase())
    );
    setUpdatedList(filtered);
  };

  const columns: ColumnsType<Attendance> = [
    {
      key: '1',
      title: 'Student name',
      render: ((value, record: Attendance, index: number) => {
        return (
          <div key={`avar_${index}`}>
            <Avatar src={
              <Image
                // width={300}
                src={record.image ? record.image : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'}
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
      render: (value, record: Attendance, i: number) => (
        <span
          key={`attendanceStatus_${i}`}
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
      render: (value, record: Attendance, i) => (
        <span
          style={{ color: record.isAuthenticated ? 'green' : 'red' }}
          key={`isAuthenticated_${i}`}
        >
          {record.isAuthenticated ? (
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
            <Radio.Group
              key={`radio_${index}`}
              name="radiogroup"
              onChange={e => handleRadioChange(e, record.studentCode!)}
              value={record.attendanceStatus}
              disabled={!isUpdate}
            // defaultValue={
            //   record.attendanceStatus !== 0 ? (
            //     record.attendanceStatus === 1 ? (1) : (2)
            //   ) : (undefined)
            // }
            >
              {/* <Radio value={0}>Not yet</Radio> */}
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
            <Input
              key={`cmt-${index}`}
              name='comment'
              maxLength={100}
              placeholder={isUpdate ? record.comments : ''}
              value={!isUpdate ? record.comments : undefined}
              onBlur={(e) => { handleCmtChange(e.target.value, record.studentCode!) }}
              disabled={!isUpdate}
            />
          </>
        );
      },
    },
  ];

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
      setUpdatedList(data);
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
            onSearch={(text) => {
              handleSearch(text);
              socket.close();
            }}
          // onChange={() => console.log("StudentList ", studentList)}
          // onSearch={() => {
          //   console.log("This is studentlist ", studentList);
          // }}
          />
          <Tooltip placement="top" title={'Update Attendance'}>
            <Button
              onClick={() => setIsUpdate(true)}
              type={isUpdate ? 'primary' : 'dashed'}
              shape="default"
              icon={<BiCalendarEdit />}
            />
          </Tooltip>
        </div>
      </AntHeader>

      <Table
        columns={columns}
        dataSource={
          // !isUpdate ? filteredList : updatedList
          updatedList
        }
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
        footer={() => {
          if (isUpdate) {
            return (
              <>
                <Button
                  type='dashed'
                  size='large'
                  danger
                  onClick={() => handleCancel()}
                  style={{ marginRight: '10px' }}>Cancel</Button>
                <Button type='primary' size='large'
                  onClick={() => handleSubmit()}
                >Submit</Button>
              </>
            )
          } else {
            return undefined
          }
        }}
      // rowSelection={rowSelection}
      ></Table>
    </Content>
  );
};

export default ClassDetailTable;
