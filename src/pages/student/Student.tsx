import React, { useEffect, useState } from 'react';
import styles from './Student.module.less'; // Adjust the import if necessary
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { StudentAttendanceService } from '../../hooks/StudentAttendance';
import { Slot, StudentAttendance } from '../../models/student/StudentAttendance';
import { CalendarService } from '../../hooks/Calendar';
import { Content } from 'antd/es/layout/layout';
import { ClassService } from '../../hooks/Class';
import { ClassDetails, Semester } from '../../models/Class';
import { Table, Collapse, Tag } from 'antd';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';

const { Panel } = Collapse;

const Student: React.FC = () => {
  const studentId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id || '',
  );
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [studentAttendance, setStudentAttendance] =
    useState<StudentAttendance | null>(null);
  const [semesterID, setSemesterID] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [expandedClassRows, setExpandedClassRows] = useState<number[]>([]);
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);
  const [expandedClassRow, setExpandedClassRow] = useState<number | null>(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const data = await CalendarService.getAllSemester();
        setSemesters(data || []);
      } catch (error) {
        console.error('Error fetching semesters:', error);
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    if (semesterID !== null) {
      const fetchClasses = async () => {
        try {
          const data = await ClassService.getClassBySemesterID(
            semesterID,
            studentId,
          );
          console.log('data', data);
          setClasses(data?.result || []);
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      };

      fetchClasses();
    }
  }, [semesterID, studentId]);

  useEffect(() => {
    if (classId !== null) {
      const fetchStudentAttendance = async () => {
        try {
          const data = await StudentAttendanceService.getStudentAttendance(
            studentId,
            classId,
          );
          setStudentAttendance(data || null);
        } catch (error) {
          console.error('Error fetching student attendance:', error);
        }
      };

      fetchStudentAttendance();
    }
  }, [classId, studentId]);

  console.log('attendance', studentAttendance);

  const columns = [
    {
      title: 'Semesters',
      dataIndex: 'semesterCode',
      key: '1',
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: '2',
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: '3',
    },
  ];

  const classColumns = [
    {
      title: 'Class',
      dataIndex: 'classCode',
      key: 'name',
    },
  ];

  const attendanceColumns = [
    {
      title: 'Slot',
      key: 'slot',
      dataIndex: 'slot',
      render: (_, record) => {
        const slot = studentAttendance?.result.find(
          (attendance) => attendance.slot.slotID === record.slot.slotID
        )?.slot?.slotNumber;
        return slot ?? 'N/A';
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString('en-GB');
        return formattedDate;
      },
    },
    {
      title: 'Time',
      key: 'time',
      dataIndex: 'time',
      render: (_, record) => {
        const startTime = studentAttendance?.result.find(
          (attendance) => attendance.slot.slotID === record.slot.slotID
        )?.slot?.startTime;
        const endTime = studentAttendance?.result.find(
          (attendance) => attendance.slot.slotID === record.slot.slotID
        )?.slot?.endtime;
        return (
          <div>
            {(typeof startTime === 'string' ? startTime : String(startTime ?? '')).slice(0, 5)} - {(typeof endTime === 'string' ? endTime : String(endTime ?? '')).slice(0, 5)}
          </div>
        )
      },
    },
    {
      title: 'Room',
      key: 'room',
      dataIndex: 'roomName',
      render: (_, record) => {
        const room = studentAttendance?.result.find(
          (attendance) => attendance.room.roomID === record.room.roomID
        )?.room?.roomName;
        return room ?? 'N/A';
      },
    },
    {
      title: 'Status',
      dataIndex: 'attendanceStatus',
      key: 'status',
      render: (text: number) => {
        return text === 0 ? (
          <Tag color="yellow">Not yet</Tag>
        ) : text === 1 ?(
          <Tag color="green">Attended</Tag>
        ) : text === 2 ?(
          <Tag color="red">Absence</Tag>
        ) : 'undefined';
      },
    },
  ];

  // const handleClassRowClick = (record: ClassDetails) => {
  //   setClassId(record.classID);
  //   setStudentAttendance(null); // Reset attendance data when a new class is clicked
  //   setExpandedClassRows((prevExpandedRows) => {
  //     if (prevExpandedRows.includes(record.classID)) {
  //       return prevExpandedRows.filter((id) => id !== record.classID);
  //     } else {
  //       return [...prevExpandedRows, record.classID];
  //     }
  //   });
  // };
  const handleClassRowClick = (record: ClassDetails) => {
    if (expandedClassRow === record.classID) {
      // Collapse the currently expanded class if it's clicked again
      setExpandedClassRow(null);
      setClassId(null);
      setStudentAttendance(null);
    } else {
      // Collapse any previously expanded class and expand the new one
      setExpandedClassRow(record.classID);
      setClassId(record.classID);
      setStudentAttendance(null); // Reset attendance data
    }
  };

  // const expandedRowRender = (semester: Semester) => {
  //   const filteredClasses = classes.filter(
  //     (cls) => cls.semester.semesterID === semester.semesterID,
  //   );

  //   return (
  //     <Collapse>
  //       <Panel header="Classes" key="1">
  //         <Table
  //           columns={classColumns}
  //           dataSource={filteredClasses}
  //           rowKey="classID"
  //           onRow={(record) => ({
  //             onClick: () => handleClassRowClick(record),
  //           })}
  //           onExpand={(expanded, record) => {
  //             if (expanded) {
  //               setSemesterID(record.semester.semesterID);
  //             }
  //           }}
  //           expandable={{
  //             expandedRowRender: (record) =>
  //               expandedClassRows.includes(record.classID) && (
  //                 <Table
  //                   columns={attendanceColumns}
  //                   dataSource={
  //                     studentAttendance?.result
  //                   }
  //                   rowKey="classID"
  //                 />
  //               ),
  //             rowExpandable: (record) =>
  //               expandedClassRows.includes(record.classID),
  //           }}
  //           expandedRowKeys={expandedClassRows}
  //         />
  //       </Panel>
  //     </Collapse>
  //   );
  // };

  const expandedRowRender = (semester: Semester) => {
    const filteredClasses = classes.filter(
      (cls) => cls.semester.semesterID === semester.semesterID,
    );

    return (
      <Collapse>
        <Panel header="Classes" key="1">
          <Table
            columns={classColumns}
            dataSource={filteredClasses}
            rowKey="classID"
            onRow={(record) => ({
              // onClick: () => handleClassRowClick(record),
            })}
            expandable={{
              expandedRowRender: (record) =>
                expandedClassRow === record.classID && (
                  <Table
                    columns={attendanceColumns}
                    dataSource={studentAttendance?.result}
                    rowKey="attendanceID"
                  />
                ),
              rowExpandable: (record) => true,
              onExpand: (expanded, record) => handleClassRowClick(record),
            }}
            expandedRowKeys={expandedClassRow ? [expandedClassRow] : []}
          />
        </Panel>
      </Collapse>
    );
  };

  const handleSemesterExpand = (expanded: boolean, record: Semester) => {
    if (expanded) {
      setExpandedSemester(record.semesterID);
      setSemesterID(record.semesterID); // Load classes for the selected semester
    } else {
      setExpandedSemester(null);
      setSemesterID(null); // Clear classes when the semester is collapsed
    }
    setExpandedClassRows([]); // Reset expanded classes when semester changes
  };

  // console.log('semester', semesterID);
  console.log('class', classId);
  // console.log('semester', studentAttendance);

  return (
    <Content className={styles.accountClassContent}>
      <div className="align-center-between">
        <ContentHeader
          contentTitle="Student Attendance"
          previousBreadcrumb={'Home / '}
          currentBreadcrumb={'Attendance'}
          key={''}
        />
      </div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
          expandedRowKeys: expandedSemester ? [expandedSemester] : [],
          onExpand: handleSemesterExpand,
        }}
        dataSource={semesters}
        rowKey="semesterID"
        pagination={false}
      />
    </Content>
  );
};

export default Student;
