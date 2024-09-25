import styles from './ClassDetail.module.less';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { RadioChangeEvent, TableProps } from 'antd';
import { Layout, Table, Typography, Avatar, Image, Button, Radio, Input, Tooltip } from 'antd';
import Search from 'antd/es/input/Search';
import { Content } from 'antd/es/layout/layout';
import { IoIosCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { BiCalendarEdit } from "react-icons/bi";


import { AttendanceService } from '../../hooks/Attendance';
import { Attendance, UpdateListAttendance } from '../../models/attendance/Attendance';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

const { Header: AntHeader } = Layout;

type props = {
  scheduleID: string,
  isOkOpen: boolean,
  studentAttendedList: string[]
}
type ColumnsType<T> = TableProps<T>['columns'];

let socket

const ClassDetailTable: React.FC<props> = ({ scheduleID, isOkOpen, studentAttendedList }) => {

  const userToken = useSelector((state: RootState) => state.auth.userDetail?.token)

  //web socket
  const [change, setChange] = useState('any');
  const [close, setClose] = useState(false);

  //student table
  const [studentList, setStudentList] = useState<Attendance[]>([])
  const [updatedList, setUpdatedList] = useState<Attendance[]>([])

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(35);
  const [isUpdate, setIsUpdate] = useState(false);

  const radioGroupRef = useRef<HTMLDivElement>(null);
  const [isManual, setIsManual] = useState(false);


  const toggleUpdateAttendance = () => {
    setIsUpdate(!isUpdate);
  };

  function activeWebSocket() {
    if (userToken) {
      socket = new WebSocket("wss://34.81.223.233/ws/client", ["access_token", userToken]);
      socket.onopen = function (event) {
        console.log('Connected websocket for slot class detail');
        // setInformation("Connected");
      };

      socket.onclose = function (event) {
        console.log("Connection closed");
        console.log(event);
      };

      socket.onmessage = function (event) {
        console.log("Event coming", event);

        const message = JSON.parse(event.data);
        console.log("mess message event*", message.Event);
        console.log("mess message Data*", message.Data);
        switch (message.Event) {
          case "StudentAttended":
            {
              try {
                const studentIDs = message.Data.studentIDs
                if (Array.isArray(studentIDs)) {
                  console.log("This is studentIDS at studentAttended websocket event------------------ ", studentIDs);
                  studentIDs.map(item => {
                    console.log("On update item ", item);
                    console.log("List origin ", studentList);
                    console.log("update list ", updatedList);
                    // const sample = []
                    // for (let i = 0; i < studentList.length; i++) {
                    //   const student = studentList[i]
                    //   if (student.studentID === item) {
                    //     sample.push({ ...student, attendanceStatus: 1 })
                    //   } else {
                    //     sample.push(student)
                    //   }
                    // }
                    // if (sample.length > 0) {
                    //   setStudentList(sample);
                    //   setUpdatedList(sample);
                    // }

                    const element = document.getElementById(`attendanceStatus-${item}`);
                    if (element) {
                      element.innerHTML = 'Attended';
                      element.style.color = 'green';
                    }
                    const elementCheckBox = document.getElementById(`radio_${item}`) as HTMLInputElement
                    console.log("Element check box, ", elementCheckBox);
                    if (elementCheckBox) {
                      // Find the radio input with value 1 and check it
                      const radioInput = elementCheckBox.querySelector('input[value="1"]') as HTMLInputElement;
                      console.log("radioInput ", radioInput);

                      if (radioInput) {
                        radioInput.checked = true;
                      }
                    }
                  })
                }
              } catch (error) {
                toast.error('Unexpected error happened when connecting')
              }
            }
            break;
          default:
            break;
        }
      };
    }
  }
  const updateStatusManual = () => {
    setUpdatedList(updatedList.map(item => ({
      ...item,
      attendanceStatus: item.attendanceStatus === 0 ? 2 : item.attendanceStatus
    })));
  }

  const handleRadioChange = (e: RadioChangeEvent, studentCode: string) => {
    console.log("check this event ", e);
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
          comments: comments ? comments : '',
          studentID: studentID,
          scheduleID: Number(scheduleID),
          attendanceTime: currentTime,
          attendanceStatus: attendanceStatus === 0 ? 2 : attendanceStatus
        }
      }
    }).filter(item => item !== undefined);

    const response = AttendanceService.updateListAttendance(fmtUpdatedList);
    response.then(data => {
      setIsManual(true);
      setIsUpdate(false);
      getScheduleDetail()
      toast.success('Update Attendance Successfully!')
    }).catch(err => {
      const errData = err.response.data;
      if (errData && Array.isArray(errData)) {
        toast.error('Can not update status, modify time has ended!!! ');
        setIsManual(true);
        setIsUpdate(false);
        getScheduleDetail()
      }
      else {
        toast.error('Something went wrong, please try again later');
      }
    })
  }
  const handleCancel = () => {
    setIsManual(false);
    setIsUpdate(false);
    setUpdatedList(studentList);
  }
  const handleSearch = (value: string) => {
    if (value.length === 0) {
      setUpdatedList(studentList)
    } else {
      const filtered = studentList.filter((item) =>
        item.studentCode!.toLowerCase().includes(value.toLowerCase()) ||
        item.studentName!.toLowerCase().includes(value.toLowerCase())
      );
      setUpdatedList(filtered);
    }
  };

  const columns: ColumnsType<Attendance> = [
    {
      key: '0',
      title: '#',
      render: ((value, record: Attendance, index: number) => {
        return (
          <div key={`index_${index}`}>
            {index + 1}
          </div>
        )
      }),
    },
    {
      key: '1',
      title: 'Student name',
      render: ((value, record: Attendance, index: number) => {
        return (
          <div key={`avar_${index}`}>
            <Avatar
              src={
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
              ref={radioGroupRef}
              key={`radio_${record.studentID}`}
              name="radiogroup"
              onChange={e => handleRadioChange(e, record.studentCode!)}
              value={record.attendanceStatus ? record.attendanceStatus : 2}
              // value={record.attendanceStatus && record.attendanceStatus}
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

  const getScheduleDetail = () => {
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
  }

  useEffect(() => {
    getScheduleDetail()
  }, [])

  useEffect(() => {
    if (isOkOpen) {
      activeWebSocket();

      return () => {
        socket.close();
      };
    }
  }, [isOkOpen])

  useEffect(() => {
    if (studentAttendedList.length > 0 && !isManual) {
      console.log("Student attended list has changed, ", studentAttendedList);
      const uniqueStudents = new Map();

      // studentAttendedList.map(item => {
      // let isUnique = false;
      // for (let i = 0; i < studentList.length; i++) {
      //   const student = studentList[i]
      //   if (student.studentID && student.studentID === item) {
      //     uniqueStudents.set(student.studentID, { ...student, attendanceStatus: 1 });
      //   } else {
      //     uniqueStudents.set(student.studentID, student);
      //   }
      // }
      // })

      for (let i = 0; i < studentList.length; i++) {
        const student = studentList[i];
        if (student.studentID) {
          const isValid = studentAttendedList.includes(student.studentID)
          if (isValid) {
            uniqueStudents.set(student.studentID, { ...student, attendanceStatus: 1 });
          } else {
            uniqueStudents.set(student.studentID, student);
          }
        }
      }

      const result = Array.from(uniqueStudents.values())
      console.log("uniqueStudents", result);
      if (result.length > 0) {
        setStudentList(Array.from(uniqueStudents.values()));
        setUpdatedList(Array.from(uniqueStudents.values()));
        setIsManual(false);
      }
    }
  }, [studentAttendedList])

  useEffect(() => {
    console.log("Change of update list", updatedList);
    console.log("Change of student list", studentList);
  }, [updatedList, studentList])

  return (
    <Content className={styles.classDetailContent}>
      <AntHeader className={styles.classDetailHeader}>
        <Typography.Title level={3} style={{ marginTop: 5 }}
          onClick={() => {
            console.log("update list ", updatedList);
          }}
        >
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
              // socket.close();
            }}
          // onChange={() => console.log("StudentList ", studentList)}
          // onSearch={() => {
          //   console.log("This is studentlist ", studentList);
          // }}
          />
          <Tooltip placement="top" title={'Update Attendance'}>
            <Button
              onClick={() => {
                setIsUpdate(true)
                updateStatusManual();
              }}
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
