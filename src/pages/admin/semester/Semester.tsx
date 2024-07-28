import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Radio,
  Row,
  Table,
  DatePicker,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import styles from './Semester.module.less';
import type {
  Semester,
} from '../../../models/calendar/Semester';
import { CalendarService } from '../../../hooks/Calendar';
import { CiSearch, CiEdit } from 'react-icons/ci';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import {
  clearSemesterMessages,
  createSemester,
  updateSemester,
} from '../../../redux/slice/Semester';
import { SemesterService } from '../../../hooks/Semester';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IoMdInformation } from 'react-icons/io';

const { Header: AntHeader } = Layout;

const Semester: React.FC = () => {
  const [semester, setSemester] = useState<Semester[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemester, setFilteredSemester] =
    useState<Semester[]>(semester);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [semesterID, setSemesterID] = useState(0);
  const [SemesterCode, setSemesterCode] = useState('');
  const [SemesterStatus, setSemesterStatus] = useState(false);
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [CreatedBy, setCreatedBy] = useState('');

  const [reload, setReload] = useState(0);
  const [isCheck, setIsCheck] = useState(false);
  const dispatch = useDispatch();

  const handleRowClick = (semesterID: number) => {
    navigate(`/semester/semester-detail`, {
      state: { semesterID: semesterID },
    });
  };

  const failMessage = useSelector(
    (state: RootState) => state.semester.semesterDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.semester.message,
  );

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
  }, [reload]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearSemesterMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.errors}`);
      dispatch(clearSemesterMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const showModalUpdate = (item?: Semester) => {
    setIsCheck(true);
    if (item) {
      setSemesterID(item.semesterID!);
      setSemesterCode(item.semesterCode!);
      setSemesterStatus(item.semesterStatus!);
      setStartDate(item.startDate!);
      setEndDate(item.endDate!);
    } else {
      resetModalFields();
    }
    setIsModalVisible(true);
  };

  const showModalCreate = () => {
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const handleCreate = async () => {
    setLoading(true);
    await CreatedNewSemester(
      SemesterCode,
      SemesterStatus,
      StartDate,
      EndDate,
      CreatedBy,
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const handleUpdate = async () => {
    setLoading(true);
    await updateExistingSemester(
      SemesterCode,
      SemesterStatus,
      StartDate,
      EndDate,
      semesterID,
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setSemesterID(0);
    setSemesterCode('');
    setSemesterStatus(false);
    setStartDate('');
    setEndDate('');
    setCreatedBy('');
    setIsCheck(false);
  };
  const columns = [
    {
      key: '1',
      title: 'Semester',
      dataIndex: 'semester',
    },
    {
      key: '2',
      title: 'Semester status',
      dataIndex: 'semesterstatus',
    },
    {
      key: '3',
      title: 'Start date',
      dataIndex: 'startdate',
    },
    {
      key: '4',
      title: 'End date',
      dataIndex: 'enddate',
    },
    {
      key: '5',
      title: 'Action',
      dataIndex: 'action',
    },
    {
      key: '6',
      title: 'Info',
      dataIndex: 'info',
      render: (semesterID: number) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(semesterID);
            }}
            shape="circle"
            style={{ border: 'none' }}
          >
            <span><IoMdInformation size={25}/></span>
          </Button>
        </div>
      ),
    },
  ];

  const handleSearchSemester = (value: string) => {
    setSearchInput(value);
    const filtered = semester.filter(
      (item) =>
        item.semesterCode &&
        item.semesterCode.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSemester(filtered);
    setIsUpdate(true);
  };

  const CreatedNewSemester = async (
    SemesterCode: string,
    SemesterStatus: boolean,
    StartDate: string,
    EndDate: string,
    CreatedBy: string,
  ) => {
    const arg = {
      SemesterCode: SemesterCode,
      SemesterStatus: SemesterStatus,
      StartDate: StartDate,
      EndDate: EndDate,
      CreatedBy: CreatedBy,
    };
    await dispatch(createSemester(arg) as any);
    setIsCheck(false);
  };

  const updateExistingSemester = async (
    SemesterCode: string,
    SemesterStatus: boolean,
    StartDate: string,
    EndDate: string,
    semesterID: number,
  ) => {
    const arg = {
      SemesterCode: SemesterCode,
      SemesterStatus: SemesterStatus,
      StartDate: StartDate,
      EndDate: EndDate,
      semesterID: semesterID,
    };
    await dispatch(updateSemester(arg) as any);
  };

  const deleteSemester = async (semesterID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this semester?',
      onOk: async () => {
        await SemesterService.deleteSemester(semesterID);
        message.success('Semester deleted successfully');
        setReload((prevReload) => prevReload + 1);
      },
    });
  };

  return (
    <Content className={styles.accountSemesterContent}>
      <ContentHeader
        contentTitle="Semester"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Semester'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Semester</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchSemester(e.target.value)}
                ></Input>
              </Col>
              <Col>
                <Button
                  onClick={showModalCreate}
                  type="primary"
                  icon={<PlusOutlined />}
                >
                  Add New
                </Button>
              </Col>
            </Row>
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(!isUpdate ? semester : filteredSemester).map(
          (item, index) => ({
            key: index,
            semester: item.semesterCode,
            semesterstatus: (
              <div>
                <p style={{ color: item.semesterStatus ? 'green' : 'red' }}>
                  {item.semesterStatus ? 'active' : 'inactive'}
                </p>
              </div>
            ),
            startdate: moment(item.startDate, 'YYYY-MM-DD').format(
              'DD/MM/YYYY',
            ),
            enddate: moment(item.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            action: (
              <div>
                <Button
                  shape="circle"
                  style={{ border: 'none', backgroundColor: 'white' }}
                >
                  <CiEdit
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCheck(true);
                      showModalUpdate(item);
                    }}
                    size={20}
                    style={{ color: 'blue' }}
                  />
                </Button>

                <Button
                  shape="circle"
                  style={{ border: 'none', backgroundColor: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSemester(item.semesterID!);
                  }}
                >
                  <MdDeleteForever size={20} style={{ color: 'red' }} />
                </Button>
              </div>
            ),
            info: item.semesterID,
            register: item,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record.register.semesterID),
        // })}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Semester' : 'Add New Semester'}
        visible={isModalVisible}
        // onOk={isCheck ? handleUpdate : handleCreate}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={isCheck ? handleUpdate : handleCreate}
            // disabled={!isFormValid()}
          >
            Submit
          </Button>,
        ]}
      >
        <p className={styles.createSemesterTitle}>Semester Code</p>
        <Input
          placeholder="Semester Code"
          value={SemesterCode}
          onChange={(e) => setSemesterCode(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createSemesterTitle}>Semester Status</p>
        <Radio.Group
          onChange={(e) => setSemesterStatus(e.target.value)}
          value={SemesterStatus}
          style={{ marginBottom: '10px' }}
        >
          <Radio value={1}>Active</Radio>
          <Radio value={0}>Inactive</Radio>
        </Radio.Group>
        <p className={styles.createSemesterTitle}>Start Date</p>
        <DatePicker
          placeholder="Start Date"
          value={StartDate ? moment(StartDate, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setStartDate(`${dateString}`)}
          format="YYYY-MM-DD"
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <p className={styles.createSemesterTitle}>End Date</p>
        <DatePicker
          placeholder="End Date"
          value={EndDate ? moment(EndDate, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setEndDate(`${dateString}`)}
          format="YYYY-MM-DD"
          style={{ marginBottom: '10px', width: '100%' }}
        />

        {!isCheck && (
          <>
            <p className={styles.createSemesterTitle}>Create By</p>
            <Input
              placeholder="Create By"
              value={CreatedBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
          </>
        )}
      </Modal>
    </Content>
  );
};

export default Semester;

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Button,
//   Card,
//   Col,
//   Input,
//   Layout,
//   message,
//   Modal,
//   Radio,
//   Row,
//   Table,
//   DatePicker,
// } from 'antd';
// import { Content } from 'antd/es/layout/layout';
// import moment from 'moment';
// import { CiSearch, CiEdit } from 'react-icons/ci';
// import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
// import { MdDeleteForever } from 'react-icons/md';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../redux/Store';
// import {
//   clearSemesterMessages,
//   createSemester,
//   updateSemester,
// } from '../../../redux/slice/Semester';
// import { SemesterService } from '../../../hooks/Semester';
// import { PlusOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import styles from './Semester.module.less';
// import type { Semester } from '../../../models/calendar/Semester';
// import { CalendarService } from '../../../hooks/Calendar';

// const { Header: AntHeader } = Layout;

// const columns = [
//   {
//     key: '1',
//     title: 'Semester',
//     dataIndex: 'semester',
//   },
//   {
//     key: '2',
//     title: 'Semester status',
//     dataIndex: 'semesterstatus',
//   },
//   {
//     key: '3',
//     title: 'Start date',
//     dataIndex: 'startdate',
//   },
//   {
//     key: '4',
//     title: 'End date',
//     dataIndex: 'enddate',
//   },
//   {
//     key: '5',
//     title: 'Action',
//     dataIndex: 'action',
//   },
// ];

// const Semester: React.FC = () => {
//   const [semester, setSemester] = useState<Semester[]>([]);
//   const [searchInput, setSearchInput] = useState('');
//   const [filteredSemester, setFilteredSemester] = useState<Semester[]>(semester);
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [semesterID, setSemesterID] = useState(0);
//   const [SemesterCode, setSemesterCode] = useState('');
//   const [SemesterStatus, setSemesterStatus] = useState(false);
//   const [StartDate, setStartDate] = useState('');
//   const [EndDate, setEndDate] = useState('');
//   const [CreatedBy, setCreatedBy] = useState('');

//   const [reload, setReload] = useState(0);
//   const [isCheck, setIsCheck] = useState(false);
//   const dispatch = useDispatch();

//   const handleRowClick = (semesterID: number) => {
//     navigate(`/semester/semester-detail`, {
//       state: { semesterID: semesterID },
//     });
//   };

//   const failMessage = useSelector(
//     (state: RootState) => state.semester.semesterDetail,
//   );
//   const successMessage = useSelector(
//     (state: RootState) => state.semester.message,
//   );

//   useEffect(() => {
//     const response = CalendarService.getAllSemester();

//     response
//       .then((data) => {
//         setSemester(data || []);
//       })
//       .catch((error) => {
//         console.log('get semester error: ', error);
//       });
//   }, [reload]);

//   useEffect(() => {
//     if (successMessage) {
//       message.success(successMessage);
//       setReload((prevReload) => prevReload + 1);
//       setIsModalVisible(false);
//       resetModalFields();
//       dispatch(clearSemesterMessages());
//     }
//     if (failMessage && failMessage.data) {
//       message.error(`${failMessage.data.data.data.errors}`);
//       dispatch(clearSemesterMessages());
//     }
//   }, [successMessage, failMessage, dispatch]);

//   const showModalUpdate = (item?: Semester) => {
//     setIsCheck(true);
//     if (item) {
//       setSemesterID(item.semesterID!);
//       setSemesterCode(item.semesterCode!);
//       setSemesterStatus(item.semesterStatus!);
//       setStartDate(item.startDate!);
//       setEndDate(item.endDate!);
//     } else {
//       resetModalFields();
//     }
//     setIsModalVisible(true);
//   };

//   const showModalCreate = () => {
//     setIsCheck(false);
//     setIsModalVisible(true);
//   };

//   const handleCreate = async () => {
//     setLoading(true);
//     await CreatedNewSemester(
//       SemesterCode,
//       SemesterStatus,
//       StartDate,
//       EndDate,
//       CreatedBy,
//     );
//     setLoading(false);
//     setIsModalVisible(false);
//     resetModalFields();
//     setReload((prevReload) => prevReload + 1);
//   };

//   const handleUpdate = async () => {
//     setLoading(true);
//     await updateExistingSemester(
//       SemesterCode,
//       SemesterStatus,
//       StartDate,
//       EndDate,
//       semesterID,
//     );
//     setLoading(false);
//     setIsModalVisible(false);
//     resetModalFields();
//     setReload((prevReload) => prevReload + 1);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     resetModalFields();
//   };

//   const resetModalFields = () => {
//     setSemesterID(0);
//     setSemesterCode('');
//     setSemesterStatus(false);
//     setStartDate('');
//     setEndDate('');
//     setCreatedBy('');
//     setIsCheck(false);
//   };

//   const handleSearchSemester = (value: string) => {
//     setSearchInput(value);
//     const filtered = semester.filter(
//       (item) =>
//         item.semesterCode &&
//         item.semesterCode.toLowerCase().includes(value.toLowerCase()),
//     );
//     setFilteredSemester(filtered);
//     setIsUpdate(true);
//   };

//   const CreatedNewSemester = async (
//     SemesterCode: string,
//     SemesterStatus: boolean,
//     StartDate: string,
//     EndDate: string,
//     CreatedBy: string,
//   ) => {
//     const arg = {
//       SemesterCode: SemesterCode,
//       SemesterStatus: SemesterStatus,
//       StartDate: StartDate,
//       EndDate: EndDate,
//       CreatedBy: CreatedBy,
//     };
//     await dispatch(createSemester(arg) as any);
//     setIsCheck(false);
//   };

//   const updateExistingSemester = async (
//     SemesterCode: string,
//     SemesterStatus: boolean,
//     StartDate: string,
//     EndDate: string,
//     semesterID: number,
//   ) => {
//     const arg = {
//       SemesterCode: SemesterCode,
//       SemesterStatus: SemesterStatus,
//       StartDate: StartDate,
//       EndDate: EndDate,
//       semesterID: semesterID,
//     };
//     await dispatch(updateSemester(arg) as any);
//   };

//   const deleteSemester = async (semesterID: number) => {
//     Modal.confirm({
//       title: 'Confirm Deletion',
//       content: 'Are you sure you want to delete this semester?',
//       onOk: async () => {
//         await SemesterService.deleteSemester(semesterID);
//         message.success('Semester deleted successfully');
//         setReload((prevReload) => prevReload + 1);
//       },
//     });
//   };

//   const dataSource = useMemo(() => {
//     return (!isUpdate ? semester : filteredSemester).map((item, index) => ({
//       key: index,
//       semester: item.semesterCode,
//       semesterstatus: (
//         <div>
//           <p style={{ color: item.semesterStatus ? 'green' : 'red' }}>
//             {item.semesterStatus ? 'active' : 'inactive'}
//           </p>
//         </div>
//       ),
//       startdate: moment(item.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
//       enddate: moment(item.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
//       action: (
//         <div>
//           <Button
//             shape="circle"
//             style={{ border: 'none', backgroundColor: 'white' }}
//           >
//             <CiEdit
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsCheck(true);
//                 showModalUpdate(item);
//               }}
//               size={20}
//               style={{ color: 'blue' }}
//             />
//           </Button>

//           <Button
//             shape="circle"
//             style={{ border: 'none', backgroundColor: 'white' }}
//             onClick={(e) => {
//               e.stopPropagation();
//               deleteSemester(item.semesterID!);
//             }}
//           >
//             <MdDeleteForever size={20} style={{ color: 'red' }} />
//           </Button>
//         </div>
//       ),
//       register: item,
//     }));
//   }, [isUpdate, semester, filteredSemester]);

//   return (
//     <Content className={styles.accountSemesterContent}>
//       <ContentHeader
//         contentTitle="Semester"
//         previousBreadcrumb={'Home / '}
//         currentBreadcrumb={'Semester'}
//         key={''}
//       />
//       <Card className={styles.cardHeader}>
//         <Content>
//           <AntHeader className={styles.tableHeader}>
//             <p className={styles.tableTitle}>Semester</p>
//             <Row gutter={[16, 16]}>
//               <Col>
//                 <Input
//                   placeholder="Search by name"
//                   suffix={<CiSearch />}
//                   variant="filled"
//                   value={searchInput}
//                   onChange={(e) => handleSearchSemester(e.target.value)}
//                 ></Input>
//               </Col>
//               <Col>
//                 <Button
//                   onClick={showModalCreate}
//                   type="primary"
//                   icon={<PlusOutlined />}
//                 >
//                   Add New
//                 </Button>
//               </Col>
//             </Row>
//           </AntHeader>
//         </Content>
//       </Card>
//       <Table
//         columns={columns}
//         dataSource={dataSource}
//         pagination={{
//           showSizeChanger: true,
//         }}
//         onRow={(record) => ({
//           onClick: () => handleRowClick(record.register.semesterID),
//         })}
//       ></Table>
//       <Modal
//         title={isCheck ? 'Edit Semester' : 'Add New Semester'}
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={[
//           <Button key="back" onClick={handleCancel}>
//             Return
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={loading}
//             onClick={isCheck ? handleUpdate : handleCreate}
//           >
//             Submit
//           </Button>,
//         ]}
//       >
//         <p className={styles.createSemesterTitle}>Semester Code</p>
//         <Input
//           placeholder="Semester Code"
//           value={SemesterCode}
//           onChange={(e) => setSemesterCode(e.target.value)}
//           style={{ marginBottom: '10px' }}
//         />
//         <p className={styles.createSemesterTitle}>Semester Status</p>
//         <Radio.Group
//           onChange={(e) => setSemesterStatus(e.target.value)}
//           value={SemesterStatus}
//           style={{ marginBottom: '10px' }}
//         >
//           <Radio value={1}>Active</Radio>
//           <Radio value={0}>Inactive</Radio>
//         </Radio.Group>
//         <p className={styles.createSemesterTitle}>Start Date</p>
//         <DatePicker
//           placeholder="Start Date"
//           value={StartDate ? moment(StartDate, 'YYYY-MM-DD') : null}
//           onChange={(date, dateString) => setStartDate(`${dateString}`)}
//           format="YYYY-MM-DD"
//           style={{ marginBottom: '10px', width: '100%' }}
//         />
//         <p className={styles.createSemesterTitle}>End Date</p>
//         <DatePicker
//           placeholder="End Date"
//           value={EndDate ? moment(EndDate, 'YYYY-MM-DD') : null}
//           onChange={(date, dateString) => setEndDate(`${dateString}`)}
//           format="YYYY-MM-DD"
//           style={{ marginBottom: '10px', width: '100%' }}
//         />

//         {!isCheck && (
//           <>
//             <p className={styles.createSemesterTitle}>Create By</p>
//             <Input
//               placeholder="Create By"
//               value={CreatedBy}
//               onChange={(e) => setCreatedBy(e.target.value)}
//             />
//           </>
//         )}
//       </Modal>
//     </Content>
//   );
// };

// export default Semester;