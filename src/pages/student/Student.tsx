import React, { useEffect, useState } from 'react';
import { Table, TableColumnType, Layout } from 'antd';
import styles from './Student.module.less'; // Adjust the import if necessary
import { UserInfo } from '../../models/UserInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { StudentAttendanceService } from '../../hooks/StudentAttendance';
import { StudentAttendance } from '../../models/student/StudentAttendance';
import { CalendarService } from '../../hooks/Calendar';

const { Content } = Layout;

interface Slot {
  slotID: number;
  slotName: string;
  date: string;
  slotNumber: number;
  room: string;
  status: string;
  startTime: string;
  endTime: string;
  classCode: string;
  comments: string;
}

interface Course {
  courseID: number;
  courseName: string;
  slots: Slot[];
}

interface Semester {
  semesterID: number;
  semesterCode: string;
  courses: Course[];
}

const semestersData: Semester[] = [
  {
    semesterID: 1,
    semesterCode: 'Spring 2023',
    courses: [
      {
        courseID: 1,
        courseName: 'Mathematics',
        slots: [
          {
            slotID: 1,
            slotName: 'Slot 1',
            date: '2023-01-10',
            slotNumber: 1,
            room: 'Room 101',
            status: 'Absent',
            startTime: '09:00',
            endTime: '10:30',
            classCode: 'MATH101',
            comments: 'Regular class',
          },
          {
            slotID: 2,
            slotName: 'Slot 2',
            date: '2023-01-12',
            slotNumber: 2,
            room: 'Room 102',
            status: 'Present',
            startTime: '11:00',
            endTime: '12:30',
            classCode: 'MATH102',
            comments: 'Regular class',
          },
        ],
      },
    ],
  },
  {
    semesterID: 2,
    semesterCode: 'Fall 2023',
    courses: [
      {
        courseID: 2,
        courseName: 'Physics',
        slots: [
          {
            slotID: 3,
            slotName: 'Slot 1',
            date: '2023-09-10',
            slotNumber: 1,
            room: 'Room 201',
            status: 'Active',
            startTime: '09:00',
            endTime: '10:30',
            classCode: 'PHYS101',
            comments: 'Lab class',
          },
          {
            slotID: 4,
            slotName: 'Slot 2',
            date: '2023-09-12',
            slotNumber: 2,
            room: 'Room 202',
            status: 'Active',
            startTime: '11:00',
            endTime: '12:30',
            classCode: 'PHYS102',
            comments: 'Lab class',
          },
        ],
      },
    ],
  },
];

const Student: React.FC = () => {
  const studentId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id || '',
  );
  const [studentAttendance, setStudentAttendance] =
    useState<StudentAttendance>();
  const [semester, setSemester] = useState<Semester[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState();
  const [scheduleID, setScheduleID] = useState();
  const [classId, setClassId] = useState();

  useEffect(() => {
    const response = CalendarService.getAllSemester();

    response
      .then((data) => {
        setSemester(data || []);
        // setFilteredSemester(data || []);
      })
      .catch((error) => {
        console.log('get semester error: ', error);
      });
  }, []);

  useEffect(() => {
    if (attendanceStatus !== undefined) {
      const response = StudentAttendanceService.getStudentAttendance(
        // attendanceStatus,
        // scheduleID,
        studentId,
        // classId,
      );

      response
        .then((data) => {
          setStudentAttendance(data || undefined);
        })
        .catch((error) => {
          console.log('get student attendance error: ', error);
        });
    }
  }, [studentId]);

  console.log('attendace:', studentAttendance);
  console.log('semester', semester)

  const semesterColumns: TableColumnType<Semester>[] = [
    {
      title: 'Semester',
      dataIndex: 'semesterName',
      key: 'semesterName',
      render: (text: string, record: Semester) => <a>{text}</a>,
    },
  ];

  const courseColumns: TableColumnType<Course>[] = [
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text: string, record: Course) => <a>{text}</a>,
    },
  ];

  const slotColumns: TableColumnType<Slot>[] = [
    {
      title: 'Slot ID',
      dataIndex: 'slotID',
      key: 'slotID',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Slot',
      dataIndex: 'slotNumber',
      key: 'slotNumber',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Class Code',
      dataIndex: 'classCode',
      key: 'classCode',
    },
    {
      title: 'Attendance Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
  ];

  const expandedRowRender = (record: any) => {
    if (record.courses) {
      return (
        <Table
          columns={courseColumns}
          dataSource={record.courses}
          rowKey="courseID"
          pagination={false}
          expandable={{
            expandedRowRender: (courseRecord) => (
              <Table
                columns={slotColumns}
                dataSource={courseRecord.slots}
                rowKey="slotID"
                pagination={false}
              />
            ),
            rowExpandable: (courseRecord) => courseRecord.slots.length > 0,
          }}
        />
      );
    }
    return null;
  };

  return (
    <Content className={styles.accountClassContent}>
      <Table
        columns={semesterColumns}
        dataSource={semestersData}
        rowKey="semesterID"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.courses.length > 0,
        }}
        pagination={false}
      />
    </Content>
  );
};

export default Student;
