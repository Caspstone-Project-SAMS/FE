// import React, { useEffect, useState } from 'react';
// import { Table, TableColumnType, Layout } from 'antd';
// import styles from './Student.module.less'; // Adjust the import if necessary
// import { UserInfo } from '../../models/UserInfo';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/Store';
// import { StudentAttendanceService } from '../../hooks/StudentAttendance';
// import { StudentAttendance } from '../../models/student/StudentAttendance';
// import { CalendarService } from '../../hooks/Calendar';

// const { Content } = Layout;

// interface Slot {
//   slotID: number;
//   slotName: string;
//   date: string;
//   slotNumber: number;
//   room: string;
//   status: string;
//   startTime: string;
//   endTime: string;
//   classCode: string;
//   comments: string;
// }

// interface Course {
//   courseID: number;
//   courseName: string;
//   slots: Slot[];
// }

// interface Semester {
//   semesterID: number;
//   semesterCode: string;
//   courses: Course[];
// }

// const Student: React.FC = () => {
//   const studentId = useSelector(
//     (state: RootState) => state.auth.userDetail?.result?.id || '',
//   );
//   const [studentAttendance, setStudentAttendance] =
//     useState<StudentAttendance>();
//   const [semester, setSemester] = useState<Semester[]>([]);
//   const [attendanceStatus, setAttendanceStatus] = useState();
//   const [scheduleID, setScheduleID] = useState();
//   const [classId, setClassId] = useState();

//   useEffect(() => {
//     const response = CalendarService.getAllSemester();

//     response
//       .then((data) => {
//         setSemester(data || []);
//         // setFilteredSemester(data || []);
//       })
//       .catch((error) => {
//         console.log('get semester error: ', error);
//       });
//   }, []);

//   useEffect(() => {
//     if (attendanceStatus !== undefined) {
//       const response = StudentAttendanceService.getStudentAttendance(
//         // attendanceStatus,
//         // scheduleID,
//         studentId,
//         // classId,
//       );

//       response
//         .then((data) => {
//           setStudentAttendance(data || undefined);
//         })
//         .catch((error) => {
//           console.log('get student attendance error: ', error);
//         });
//     }
//   }, [studentId]);

//   const semestersData: Semester[] = [
//     {
//       semesterID: 1,
//       semesterCode: 'Spring 2023',
//       courses: [
//         {
//           courseID: 1,
//           courseName: 'Mathematics',
//           slots: [
//             {
//               slotID: 1,
//               slotName: 'Slot 1',
//               date: '2023-01-10',
//               slotNumber: 1,
//               room: 'Room 101',
//               status: 'Absent',
//               startTime: '09:00',
//               endTime: '10:30',
//               classCode: 'MATH101',
//               comments: 'Regular class',
//             },
//             {
//               slotID: 2,
//               slotName: 'Slot 2',
//               date: '2023-01-12',
//               slotNumber: 2,
//               room: 'Room 102',
//               status: 'Present',
//               startTime: '11:00',
//               endTime: '12:30',
//               classCode: 'MATH102',
//               comments: 'Regular class',
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   console.log('attendace:', studentAttendance);

//   const semesterColumns: TableColumnType<Semester>[] = [
//     {
//       title: 'Semester',
//       dataIndex: 'semesterCode',
//       key: 'semesterCode',
//       render: (text: string, record: Semester) => <a>{text}</a>,
//     },
//   ];

//   const courseColumns: TableColumnType<Course>[] = [
//     {
//       title: 'Course',
//       dataIndex: 'courseName',
//       key: 'courseName',
//       render: (text: string, record: Course) => <a>{text}</a>,
//     },
//   ];

//   const slotColumns: TableColumnType<Slot>[] = [
//     {
//       title: 'Slot ID',
//       dataIndex: 'slotID',
//       key: 'slotID',
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//     },
//     {
//       title: 'Slot',
//       dataIndex: 'slotNumber',
//       key: 'slotNumber',
//     },
//     {
//       title: 'Room',
//       dataIndex: 'room',
//       key: 'room',
//     },
//     {
//       title: 'Start Time',
//       dataIndex: 'startTime',
//       key: 'startTime',
//     },
//     {
//       title: 'End Time',
//       dataIndex: 'endTime',
//       key: 'endTime',
//     },
//     {
//       title: 'Class Code',
//       dataIndex: 'classCode',
//       key: 'classCode',
//     },
//     {
//       title: 'Attendance Status',
//       dataIndex: 'status',
//       key: 'status',
//     },
//     {
//       title: 'Comments',
//       dataIndex: 'comments',
//       key: 'comments',
//     },
//   ];

//   const expandedRowRender = (record: any) => {
//     if (record.courses) {
//       return (
//         <Table
//           columns={courseColumns}
//           dataSource={record.courses}
//           rowKey="courseID"
//           pagination={false}
//           expandable={{
//             expandedRowRender: (courseRecord) => (
//               <Table
//                 columns={slotColumns}
//                 dataSource={courseRecord.slots}
//                 rowKey="slotID"
//                 pagination={false}
//               />
//             ),
//             rowExpandable: (courseRecord) => courseRecord.slots.length > 0,
//           }}
//         />
//       );
//     }
//     return null;
//   };

//   return (
//     <Content className={styles.accountClassContent}>
//       <Table
//         columns={semesterColumns}
//         dataSource={semestersData}
//         rowKey="semesterID"
//         expandable={{
//           expandedRowRender,
//           rowExpandable: (record) => record.courses.length > 0,
//         }}
//         pagination={false}
//       />
//     </Content>
//   );
// };

// export default Student;

// import React, { useEffect, useState } from 'react';
// import styles from './Student.module.less'; // Adjust the import if necessary
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/Store';
// import { StudentAttendanceService } from '../../hooks/StudentAttendance';
// import { StudentAttendance } from '../../models/student/StudentAttendance';
// import { CalendarService } from '../../hooks/Calendar';
// import { Content } from 'antd/es/layout/layout';
// import { ClassService } from '../../hooks/Class';
// import { Class } from '../../models/Class';

// const Student: React.FC = () => {
//   const studentId = useSelector(
//     (state: RootState) => state.auth.userDetail?.result?.id || '',
//   );
//   const [studentAttendance, setStudentAttendance] =
//     useState<StudentAttendance>();
//   const [semester, setSemester] = useState<Semester[]>([]);
//   const [classes, setClasses] = useState<Class[]>([]);
//   const [semesterID, setSemesterID] = useState(0);
//   const [attendanceStatus, setAttendanceStatus] = useState();
//   const [scheduleID, setScheduleID] = useState();
//   const [classId, setClassId] = useState(0);

//   useEffect(() => {
//     const response = CalendarService.getAllSemester();

//     response
//       .then((data) => {
//         setSemester(data || []);
//       })
//       .catch((error) => {
//         console.log('get semester error: ', error);
//       });
//   }, []);

//   useEffect(() => {
//     if (attendanceStatus !== undefined) {
//       const response = StudentAttendanceService.getStudentAttendance(
//         studentId,
//         classId,
//       );

//       response
//         .then((data) => {
//           setStudentAttendance(data || undefined);
//         })
//         .catch((error) => {
//           console.log('get student attendance error: ', error);
//         });
//     }
//   }, [studentId]);
//   useEffect(() => {
//     const response = ClassService.getClassBySemesterID(
//       semesterID,
//       studentId,
//     );

//     response
//       .then((data) => {
//         setClasses(data || []);
//       })
//       .catch((error) => {
//         console.log('get class by semesterID error: ', error);
//       });
//   }, [semesterID, studentId]);


//   return <Content>student</Content>;
// };

// export default Student;


// import React, { useEffect, useState } from 'react';
// import styles from './Student.module.less'; // Adjust the import if necessary
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/Store';
// import { StudentAttendanceService } from '../../hooks/StudentAttendance';
// import { StudentAttendance } from '../../models/student/StudentAttendance';
// import { CalendarService } from '../../hooks/Calendar';
// import { Table, Button } from 'antd';
// import { ClassService } from '../../hooks/Class';
// import { Class, ClassDetail, Semester } from '../../models/Class';
// import { Content } from 'antd/es/layout/layout';

// const Student: React.FC = () => {
//   // const studentId = useSelector(
//   //   (state: RootState) => state.auth.userDetail?.result?.id || '',
//   // );
//   const studentId = '0caf9a2e-0588-41ae-a423-08dc8640e68a';
//   const [studentAttendance, setStudentAttendance] =
//     useState<StudentAttendance>();
//   const [semesters, setSemesters] = useState<Semester[]>([]);
//   const [classes, setClasses] = useState<ClassDetail[]>([]);
//   const [semesterID, setSemesterID] = useState<number | null>(0);
//   const [attendanceStatus, setAttendanceStatus] = useState<boolean | undefined>(undefined);
//   const [classId, setClassId] = useState<number | null>(null);
  
// console.log('semester', semesters)
//   useEffect(() => {
//     const fetchSemesters = async () => {
//       try {
//         const data = await CalendarService.getAllSemester();
//         setSemesters(data || []);
//       } catch (error) {
//         console.log('get semester error: ', error);
//       }
//     };

//     fetchSemesters();
//   }, []);

//   useEffect(() => {
//     if (semesterID !== null) {
//       const fetchClasses = async () => {
//         try {
//           const data = await ClassService.getClassBySemesterID(semesterID, studentId);
//           setClasses(data || []);
//         } catch (error) {
//           console.log('get class by semesterID error: ', error);
//         }
//       };

//       fetchClasses();
//     }
//   }, [semesterID]);
//   console.log('classsssss', classes)

//   useEffect(() => {
//     if (classId !== null && attendanceStatus !== undefined) {
//       const fetchAttendance = async () => {
//         try {
//           const data = await StudentAttendanceService.getStudentAttendance(studentId, classId);
//           setStudentAttendance(data || undefined);
//         } catch (error) {
//           console.log('get student attendance error: ', error);
//         }
//       };

//       fetchAttendance();
//     }
//   }, [classId, attendanceStatus, studentId]);

//   const handleSemesterClick = (semesterID: number) => {
//     setSemesterID(semesterID);
//     setClassId(null); // Reset class selection when changing semester
//   };

//   const handleClassClick = (classID: number) => {
//     setClassId(classID);
//   };

//   const semesterColumns = [
//     { title: 'Semester Code', dataIndex: 'semesterCode', key: 1 }
//   ];

//   const classColumns = [
//     { title: 'Class Name', dataIndex: 'className', key: 1 }
//   ];

//   const attendanceColumns = [
//     { title: 'Date', dataIndex: 'date', key: 1 },
//     { title: 'Status', dataIndex: 'status', key: 2 }
//   ];

//   return (
//     <Content className={styles.studentContent}>
//       {semesters.length > 0 && (
//         <Table
//           columns={semesterColumns}
//           dataSource={semesters.map(
//             (item, index) => ({
//               key: index,
//               semesterCode: item.semesterCode,
//               semesterID: item.semesterID
//             })
//           )}
//           rowKey="id"
//           onRow={(record) => ({
//             onClick: () => handleSemesterClick(record.semesterID),
//           })}
//         />
//       )}

//       {classes.length > 0 && (
//         <Table
//           columns={classColumns}
//           dataSource={classes.map(
//             (item, index) => ({
//               key: index,
//               className: item.result.classCode,
//               classID: item.result.classID
//             })
//           )}
//           rowKey="id"
//           onRow={(record) => ({
//             onClick: () => handleClassClick(record.classID),
//           })}
//         />
//       )}

//       {studentAttendance && classId !== null && (
//         <Table
//           dataSource={studentAttendance.attendanceRecords}
//           columns={attendanceColumns}
//           rowKey="id"
//         />
//       )}
//     </Content>
//   );
// };

// export default Student;

import React, { useEffect, useState } from 'react';
import styles from './Student.module.less'; // Adjust the import if necessary
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { StudentAttendanceService } from '../../hooks/StudentAttendance';
import { StudentAttendance } from '../../models/student/StudentAttendance';
import { CalendarService } from '../../hooks/Calendar';
import { Content } from 'antd/es/layout/layout';
import { ClassService } from '../../hooks/Class';
import { Class, ClassDetail, Semester } from '../../models/Class';
import { Table, Collapse } from 'antd';

const { Panel } = Collapse;

const Student: React.FC = () => {
  const studentId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id || '',
  );
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance | null>(null);
  const [semesterID, setSemesterID] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);

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
          const data = await ClassService.getClassBySemesterID(semesterID, studentId);
          setClasses(data || []);
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
          const data = await StudentAttendanceService.getStudentAttendance(studentId, classId);
          setStudentAttendance(data || null);
        } catch (error) {
          console.error('Error fetching student attendance:', error);
        }
      };

      fetchStudentAttendance();
    }
  }, [classId, studentId]);

  const columns = [
    {
      title: 'Semester Code',
      dataIndex: 'semesterCode',
      key: 'code',
    },
  ];

  const classColumns = [
    {
      title: 'Class Name',
      dataIndex: 'classCode',
      key: 'name',
    },
  ];

  const attendanceColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const expandedRowRender = (semester: Semester) => {
    return (
      <Collapse>
        <Panel header="Classes" key="1">
          <Table
            columns={classColumns}
            dataSource={classes.filter((cls) => cls.result.semester.semesterID === semester.semesterID)}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => {
                setClassId(record.result.classID);
              },
            })}
          />
        </Panel>
        <Panel header="Student Attendance" key="2">
          <Table
            columns={attendanceColumns}
            dataSource={studentAttendance ? studentAttendance.result : []}
            rowKey="id"
          />
        </Panel>
      </Collapse>
    );
  };

  return (
    <Content>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={semesters}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            setSemesterID(record.semesterID);
            setClassId(null); // Reset class ID to show correct attendance
            setStudentAttendance(null); // Reset attendance data
          },
        })}
      />
    </Content>
  );
};

export default Student;

// import React, { useEffect, useState } from 'react';
// import styles from './Student.module.less'; // Adjust the import if necessary
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/Store';
// import { StudentAttendanceService } from '../../hooks/StudentAttendance';
// import { StudentAttendance } from '../../models/student/StudentAttendance';
// import { CalendarService } from '../../hooks/Calendar';
// import { Content } from 'antd/es/layout/layout';
// import { ClassService } from '../../hooks/Class';
// import { ClassDetail, ClassDetails, Semester } from '../../models/Class';
// import { Table, Collapse } from 'antd';

// const { Panel } = Collapse;

// const Student: React.FC = () => {
//   // const studentId = useSelector(
//   //   (state: RootState) => state.auth.userDetail?.result?.id || '',
//   // );
//   const studentId = 'fa00c1a6-0a14-435c-a421-08dc8640e68a';
//   const [semesters, setSemesters] = useState<Semester[]>([]);
//   const [classes, setClasses] = useState<ClassDetails[]>([]);
//   const [studentAttendance, setStudentAttendance] = useState<StudentAttendance | null>(null);
//   const [semesterID, setSemesterID] = useState<number | null>(null);
//   const [classId, setClassId] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchSemesters = async () => {
//       try {
//         const data = await CalendarService.getAllSemester();
//         setSemesters(data || []);
//       } catch (error) {
//         console.error('Error fetching semesters:', error);
//       }
//     };

//     fetchSemesters();
//   }, []);

//   useEffect(() => {
//     if (semesterID !== null) {
//       const fetchClasses = async () => {
//         try {
//           const data = await ClassService.getClassBySemesterID(semesterID, studentId);
//           setClasses(data?.result || []);
//         } catch (error) {
//           console.error('Error fetching classes:', error);
//         }
//       };

//       fetchClasses();
//     }
//   }, [semesterID, studentId]);

//   useEffect(() => {
//     if (classId !== null) {
//       const fetchStudentAttendance = async () => {
//         try {
//           const data = await StudentAttendanceService.getStudentAttendance(studentId, classId);
//           setStudentAttendance(data || null);
//         } catch (error) {
//           console.error('Error fetching student attendance:', error);
//         }
//       };

//       fetchStudentAttendance();
//     }
//   }, [classId, studentId]);

//   console.log('semester', semesterID)

//   const columns = [
//     {
//       title: 'Semester Code',
//       dataIndex: 'semesterCode',
//       key: 'code',
//     },
//   ];

//   const classColumns = [
//     {
//       title: 'Class Name',
//       dataIndex: 'classCode',
//       key: 'name',
//     },
//   ];

//   const attendanceColumns = [
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'attendanceStatus',
//       key: 'status',
//       render: (text: number) => {
//         return text === 0 ? <span style={{ color: 'red' }}>Absence</span> : <span style={{ color: 'green' }}>Present</span>;
//       },
//     },
//   ];

//   const expandedRowRender = (semester: Semester) => {
//     return (
//       <Collapse>
//         <Panel header="Classes" key="1">
//           <Table
//             columns={classColumns}
//             dataSource={classes.filter((cls) => cls.semester.semesterID === semester.semesterID)}
//             rowKey="classID"
//             onRow={(record) => ({
//               onClick: () => {
//                 setClassId(record.classID);
//               },
//             })}
//           />
//         </Panel>
//         {classId !== null && (
//           <Panel header="Student Attendance" key="2">
//             <Table
//               columns={attendanceColumns}
//               dataSource={studentAttendance ? studentAttendance.result : []}
//               rowKey="id"
//             />
//           </Panel>
//         )}
//       </Collapse>
//     );
//   };

//   return (
//     <Content>
//       <Table
//         columns={columns}
//         expandable={{ expandedRowRender }}
//         dataSource={semesters}
//         rowKey="semesterID"
//         onRow={(record) => ({
//           onClick: () => {
//             setSemesterID(record.semesterID);
//             setClassId(null); // Reset class ID to hide attendance
//             setStudentAttendance(null); // Reset attendance data
//           },
//         })}
//         onExpand={(expanded, record) => {
//           if (expanded) {
//             setSemesterID(record.semesterID);
//           }
//         }}
//       />
//     </Content>
//   );
// };

// export default Student;

import React, { useEffect, useState } from 'react';
import styles from './Student.module.less'; // Adjust the import if necessary
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { StudentAttendanceService } from '../../hooks/StudentAttendance';
import { StudentAttendance } from '../../models/student/StudentAttendance';
import { CalendarService } from '../../hooks/Calendar';
import { Content } from 'antd/es/layout/layout';
import { ClassService } from '../../hooks/Class';
import { ClassDetail, ClassDetails, Semester } from '../../models/Class';
import { Table, Collapse } from 'antd';

const { Panel } = Collapse;

const Student: React.FC = () => {
  // const studentId = useSelector(
  //   (state: RootState) => state.auth.userDetail?.result?.id || '',
  // );
  const studentId = 'fa00c1a6-0a14-435c-a421-08dc8640e68a';
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance | null>(null);
  const [semesterID, setSemesterID] = useState<number | null>(null);
  const [classId, setClassId] = useState<number | null>(null);
  const [expandedClassRows, setExpandedClassRows] = useState<number[]>([]);

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
          const data = await ClassService.getClassBySemesterID(semesterID, studentId);
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
          const data = await StudentAttendanceService.getStudentAttendance(studentId, classId);
          setStudentAttendance(data || null);
        } catch (error) {
          console.error('Error fetching student attendance:', error);
        }
      };

      fetchStudentAttendance();
    }
  }, [classId, studentId]);

  const columns = [
    {
      title: 'Semesters',
      dataIndex: 'semesterCode',
      key: 'code',
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'attendanceStatus',
      key: 'status',
      render: (text: number) => {
        return text === 0 ? <span style={{ color: 'red' }}>Absence</span> : <span style={{ color: 'green' }}>Present</span>;
      },
    },
  ];

  const handleClassRowClick = (record: ClassDetails) => {
    setClassId(record.classID);
    setStudentAttendance(null); // Reset attendance data when a new class is clicked
    setExpandedClassRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(record.classID)) {
        return prevExpandedRows.filter((id) => id !== record.classID);
      } else {
        return [...prevExpandedRows, record.classID];
      }
    });
  };

  const expandedRowRender = (semester: Semester) => {
    const filteredClasses = classes.filter((cls) => cls.semester.semesterID === semester.semesterID);
    return (
      <Collapse>
        <Panel header="Classes" key="1">
          <Table
            columns={classColumns}
            dataSource={filteredClasses}
            rowKey="classID"
            onRow={(record) => ({
              onClick: () => handleClassRowClick(record),
            })}
            onExpand={(expanded, record) => {
              if (expanded) {
                setSemesterID(record.semester.semesterID);
              }
            }}
            expandable={{
              expandedRowRender: (record) => (
                expandedClassRows.includes(record.classID) && (
                  <Table
                    columns={attendanceColumns}
                    dataSource={studentAttendance ? studentAttendance.result : []}
                    rowKey="id"
                  />
                )
              ),
              rowExpandable: (record) => expandedClassRows.includes(record.classID),
            }}
            expandedRowKeys={expandedClassRows}
          />
        </Panel>
      </Collapse>
    );
  };

  console.log('semester', semesterID)

  return (
    <Content>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={semesters}
        rowKey="semesterID"
        onRow={(record) => ({
          onClick: () => {
            // setSemesterID(record.semesterID);
            setClassId(null); // Reset class ID to hide attendance
            setStudentAttendance(null); // Reset attendance data
            setExpandedClassRows([]); // Reset expanded class rows
          },
        })}
        onExpand={(expanded, record) => {
          if (expanded) {
            setSemesterID(record.semesterID);
          }
        }}
      />
    </Content>
  );
};

export default Student;
