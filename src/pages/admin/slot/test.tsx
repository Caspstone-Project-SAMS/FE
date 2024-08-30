// import { Content } from 'antd/es/layout/layout';
// import React, { useState, useEffect, useCallback } from 'react';
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
//   Tag,
//   TimePicker,
// } from 'antd';
// import styles from './Slot.module.less';
// import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
// import { useNavigate } from 'react-router-dom';
// import { SlotTypeDetail, type Slot } from '../../../models/slot/Slot';
// import { SlotService } from '../../../hooks/Slot';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../redux/Store';
// import {
//   clearSlotMessages,
//   createSlot,
//   deleteSlot,
//   updateSlot,
// } from '../../../redux/slice/Slot';
// import { CiEdit, CiSearch } from 'react-icons/ci';
// import moment from 'moment';
// import { PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import { MdDeleteForever } from 'react-icons/md';

// const { Header: AntHeader } = Layout;

// const Slot: React.FC = () => {
//   const [slot, setSlot] = useState<Slot[]>([]);
//   const [slotType, setSlotType] = useState<SlotTypeDetail[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(5);
//   const [searchInput, setSearchInput] = useState('');
//   const [filteredSlots, setFilteredSlots] = useState<Slot[]>(slot);
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [SlotID, setSlotID] = useState(0);
//   const [SlotNumber, setSlotNumber] = useState(0);
//   const [Status, setStatus] = useState(1);
//   const [StartTime, setStartTime] = useState('');
//   const [Endtime, setEndtime] = useState('');

//   const [isCheck, setIsCheck] = useState(false);
//   const dispatch = useDispatch();

//   const failMessage = useSelector((state: RootState) => state.slot.slotDetail);
//   const successMessage = useSelector((state: RootState) => state.slot.message);

//   const [errors, setErrors] = useState({
//     slotNumber: '',
//     status: '',
//     startTime: '',
//     endtime: '',
//   });

//   console.log('11111111111');

//   const handleSearchSlot = useCallback(
//     (value: string) => {
//       setSearchInput(value);
//       const filtered = slot.filter(
//         (item) =>
//           item.slotNumber &&
//           item.slotNumber.toString().includes(value.toString()),
//       );
//       setFilteredSlots(filtered);
//       setIsUpdate(true);
//     },
//     [slot],
//   );

//   const fetchSlots = useCallback(async () => {
//     try {
//       const data = await SlotService.getAllSlot();
//       const datas = await SlotService.getAllSlotType();
//       setSlotType(datas?.result || []);
//       setSlot(data || []);
//     } catch (error) {
//       console.log('get slot error: ', error);
//     }
//   }, []);
//   useEffect(() => {
//     fetchSlots();
//   }, [fetchSlots]);

//   useEffect(() => {
//     if (searchInput !== '' && slot.length > 0) {
//       handleSearchSlot(searchInput);
//     } else if (searchInput === '') {
//       setIsUpdate(false);
//     }
//   }, [slot, searchInput, handleSearchSlot]);

//   useEffect(() => {
//     if (successMessage) {
//       if (successMessage === 'Update slot successfully' || successMessage === 'Create new slot successfully') {
//         message.success(successMessage);
//       } else {
//         message.success(successMessage.title);
//       }
//       setIsModalVisible(false);
//       resetModalFields();
//       dispatch(clearSlotMessages());
//     }
//     if (failMessage && failMessage.data) {
//       message.error(`${failMessage.data.data.errors}`);
//       dispatch(clearSlotMessages());
//     }
//   }, [successMessage, failMessage, dispatch]);

//   const showModalUpdate = (item?: Slot) => {
//     setIsCheck(true);
//     if (item) {
//       setSlotID(item.slotID!);
//       setSlotNumber(item.slotNumber!);
//       setStatus(item.status!);
//       setStartTime(item.startTime);
//       setEndtime(item.endtime);
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
//     const validationErrors = validateInputs();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     setLoading(true);
//     await CreatedNewSlot(
//       SlotNumber,
//       Status,
//       StartTime ? moment(StartTime, 'HH:mm').format('HH:mm:ss') : '',
//       Endtime ? moment(Endtime, 'HH:mm').format('HH:mm:ss') : '',
//     );
//     setLoading(false);
//     // setIsModalVisible(false);
//     // resetModalFields();
//     fetchSlots();
//   };

//   const handleUpdate = async () => {
//     const validationErrors = validateInputs();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     setLoading(true);
//     await updateExistingSlot(
//       SlotID,
//       SlotNumber,
//       Status,
//       StartTime ? moment(StartTime, 'HH:mm').format('HH:mm:ss') : '',
//       Endtime ? moment(Endtime, 'HH:mm').format('HH:mm:ss') : '',
//     );
//     setLoading(false);
//     // setIsModalVisible(false);
//     // resetModalFields();
//     fetchSlots();
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     resetModalFields();
//   };

//   const resetModalFields = () => {
//     setSlotID(0);
//     setSlotNumber(0);
//     setStartTime('');
//     setEndtime('');
//     setIsCheck(false);
//     setErrors({
//       slotNumber: '',
//       status: '',
//       startTime: '',
//       endtime: '',
//     });
//   };

//   const columns = [
//     {
//       key: '1',
//       title: 'Slot Number',
//       dataIndex: 'slotnumber',
//     },
//     {
//       key: '2',
//       title: 'Order',
//       dataIndex: 'order',
//     },
//     {
//       key: '3',
//       title: 'status',
//       dataIndex: 'slotstatus',
//       render: (status: boolean) => (
//         <div>
//           <Tag
//             color={status ? 'green' : 'red'}
//             style={{ fontWeight: 'bold', fontSize: '10px' }}
//           >
//             {status ? 'available' : 'unavailable'}
//           </Tag>
//         </div>
//       ),
//     },
//     {
//       key: '4',
//       title: 'Start Time',
//       dataIndex: 'starttime',
//     },
//     {
//       key: '5',
//       title: 'End Time',
//       dataIndex: 'endtime',
//     },
//     {
//       key: '6',
//       title: 'Action',
//       dataIndex: 'action',
//     },
//     // {
//     //   key: '4',
//     //   title: 'Register',
//     //   dataIndex: 'register',
//     //   render: (_: any, record: Student) => (
//     //     <div>
//     //       {record.isAuthenticated ? (
//     //         <Button
//     //           shape="circle"
//     //           style={{ border: 'none', backgroundColor: 'white' }}
//     //           disabled
//     //         >
//     //           <FaFingerprint size={20} />
//     //         </Button>
//     //       ) : (
//     //         <Button shape="circle" style={{ border: 'none' }}>
//     //           <FaFingerprint size={20} />
//     //         </Button>
//     //       )}
//     //     </div>
//     //   ),
//     // },
//   ];

//   const handlePagination = (page: number, pageSize: number) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   const handleRowClick = (slotID: number) => {
//     navigate(`/slot/slot-detail`, {
//       state: { slotID: slotID },
//     });
//   };

//   const CreatedNewSlot = async (
//     SlotNumber: number,
//     Status: number,
//     StartTime: string,
//     Endtime: string,
//   ) => {
//     const arg = {
//       SlotNumber: SlotNumber,
//       Status: Status,
//       StartTime: StartTime,
//       Endtime: Endtime,
//     };
//     await dispatch(createSlot(arg) as any);
//     setIsCheck(false);
//   };

//   const updateExistingSlot = async (
//     SlotID: number,
//     SlotNumber: number,
//     Status: number,
//     StartTime: string,
//     Endtime: string,
//   ) => {
//     const arg = {
//       SlotID: SlotID,
//       SlotNumber: SlotNumber,
//       Status: Status,
//       StartTime: StartTime,
//       Endtime: Endtime,
//     };
//     await dispatch(updateSlot(arg) as any);
//   };

//   const validateInputs = () => {
//     const errors: any = {};
//     if (!SlotNumber) errors.slotNumber = 'Slot number is required';
//     if (Status === null) errors.status = 'Slot Status is required';
//     if (!StartTime) errors.startTime = 'Start Time is required';
//     if (!Endtime) errors.endtime = 'End Time is required';
//     return errors;
//   };

//   const deleteSpecificSlot = async (slotID: number) => {
//     Modal.confirm({
//       title: 'Confirm Deletion',
//       content: 'Are you sure you want to delete this slot?',
//       onOk: async () => {
//         const arg = { SlotID: slotID };
//         await dispatch(deleteSlot(arg) as any);
//         fetchSlots();
//       },
//     });
//   };

//   return (
//     <Content className={styles.slotContent}>
//       <ContentHeader
//         contentTitle="Slot"
//         previousBreadcrumb={'Home / '}
//         currentBreadcrumb={'Slot'}
//         key={''}
//       />
//       <Card className={styles.cardHeader}>
//         <Content>
//           <AntHeader className={styles.tableHeader}>
//             <p
//               className={styles.tableTitle}
//               onClick={() => {
//                 SlotService.getSlotByPage(2);
//               }}
//             >
//               Slots
//             </p>
//             <Row gutter={[16, 16]}>
//               <Col>
//                 <Input
//                   placeholder="Search"
//                   suffix={<CiSearch />}
//                   variant="filled"
//                   value={searchInput}
//                   onChange={(e) => handleSearchSlot(e.target.value)}
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
//         dataSource={(!isUpdate ? slot : filteredSlots).map((item, index) => ({
//           key: index,
//           slotnumber: item.slotNumber,
//           order: item.order,
//           slotstatus: item.status,
//           starttime: (typeof item.startTime === 'string'
//             ? item.startTime
//             : String(item.startTime ?? '')
//           ).slice(0, 5),
//           endtime: (typeof item.endtime === 'string'
//             ? item.endtime
//             : String(item.endtime ?? '')
//           ).slice(0, 5),
//           slotID: item.slotID,
//           action: (
//             <div>
//               <Button
//                 shape="circle"
//                 style={{ border: 'none', backgroundColor: 'white' }}
//               >
//                 <CiEdit
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setIsCheck(true);
//                     showModalUpdate(item);
//                   }}
//                   size={20}
//                   style={{ color: 'blue' }}
//                 />
//               </Button>
//               <Button
//                 shape="circle"
//                 style={{ border: 'none', backgroundColor: 'white' }}
//                 onClick={() => deleteSpecificSlot(item.slotID!)}
//               >
//                 <MdDeleteForever size={20} style={{ color: 'red' }} />
//               </Button>
//             </div>
//           ),
//         }))}
//         pagination={{
//           showSizeChanger: true,
//         }}
//         // onRow={(record) => ({
//         //   onClick: () => handleRowClick(record.slotID),
//         // })}
//       ></Table>
//       <Modal
//         title={isCheck ? 'Edit Slot' : 'Add New Slot'}
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
//         <p className={styles.createSemesterTitle}>Slot Number</p>
//         <Input
//           placeholder="Slot Number"
//           value={SlotNumber}
//           onChange={(e) => {
//             setSlotNumber(Number(e.target.value));
//             setErrors((prevErrors) => ({ ...prevErrors, slotNumber: '' }));
//           }}
//           type="number"
//           style={{ marginBottom: '10px' }}
//         />
//         {errors.slotNumber && (
//           <p className={styles.errorText}>{errors.slotNumber}</p>
//         )}
//         <p className={styles.createSemesterTitle}>Slot Status</p>
//         <Radio.Group
//           onChange={(e) => {
//             setStatus(e.target.value);
//             setErrors((prevErrors) => ({ ...prevErrors, status: '' }));
//           }}
//           value={Status}
//           style={{ marginBottom: '10px' }}
//         >
//           <Radio value={1}>Available</Radio>
//           <Radio value={2}>Unavailable</Radio>
//         </Radio.Group>
//         {errors.status && <p className={styles.errorText}>{errors.status}</p>}
//         <p className={styles.createSemesterTitle}>Start Time</p>
//         <TimePicker
//           placeholder="Start Time"
//           value={StartTime ? dayjs(StartTime, 'HH:mm') : null}
//           onChange={(time, timeString) => {
//             if (typeof timeString === 'string') {
//               setStartTime(timeString);
//             }
//             setErrors((prevErrors) => ({ ...prevErrors, startTime: '' }));
//           }}
//           format="HH:mm"
//           onKeyDown={(e) => e.preventDefault()}
//           className={styles.datePicker}
//         />
//         {errors.startTime && (
//           <p className={styles.errorText}>{errors.startTime}</p>
//         )}
//         <p className={styles.createSemesterTitle}>End Time</p>
//         <TimePicker
//           placeholder="End Time"
//           value={Endtime ? dayjs(Endtime, 'HH:mm') : null}
//           onChange={(time, timeString) => {
//             if (typeof timeString === 'string') {
//               setEndtime(timeString);
//             }
//             setErrors((prevErrors) => ({ ...prevErrors, endtime: '' }));
//           }}
//           format="HH:mm"
//           onKeyDown={(e) => e.preventDefault()}
//           className={styles.datePicker}
//         />
//         {errors.endtime && <p className={styles.errorText}>{errors.endtime}</p>}
//       </Modal>
//     </Content>
//   );
// };

// export default Slot;
