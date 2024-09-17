import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Spin,
  Table,
  Tag,
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import Lottie from 'react-lottie';
import fingerprintScanAnimation from '../../../../assets/animations/Scanning_Fingerprint_animation.json';
import onlineDots from '../../../../assets/animations/Online_Dot.json';
import styles from './AccountStudents.module.less';
import { useLocation } from 'react-router-dom';
import {
  EnrolledClasses,
  FingerprintTemplate,
  StudentDetail,
} from '../../../../models/student/Student';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { ModuleService } from '../../../../hooks/Module';
import {
  Module,
  ModuleByID,
  ModuleDetail,
} from '../../../../models/module/Module';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';
import { BsFingerprint } from 'react-icons/bs';
import personIcon from '../../../../assets/imgs/person-icon.jpg';
import moduleImg from '../../../../assets/imgs/module00.png';
import {
  activeModule,
  clearModuleMessages,
} from '../../../../redux/slice/Module';
import { SessionServive } from '../../../../hooks/Session';
import modules from '../../../../assets/imgs/module.png';
import { Select } from 'antd';
import moment from 'moment';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const { Header: AntHeader } = Layout;

message.config({
  maxCount: 1,
});

const AccountStudentsDetail: React.FC = () => {
  const employeeID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.employeeID,
  );

  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const location = useLocation();
  const [student, setStudent] = useState<StudentDetail>();
  const [studentClass, setStudentClass] = useState<EnrolledClasses[]>([]);
  const [studentFinger, setStudentFinger] = useState<FingerprintTemplate[]>([]);
  const [studentID, setStudentID] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleModule, setIsModalVisibleModule] = useState(false);
  const [progressStep1, setProgressStep1] = useState(0);
  const [progressStep2, setProgressStep2] = useState(0);
  const [updatedFinger, setUpdatedFinger] = useState<number[]>([]);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);
  const [module, setModule] = useState<Module>();
  const [moduleByID, setModuleByID] = useState<ModuleDetail>();
  const [moduleID, setModuleID] = useState<number>(0);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetail[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemesterClass, setFilteredSemesterClass] =
    useState<EnrolledClasses[]>(studentClass);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);
  const [isUpdatePressed, setIsUpdatePressed] = useState(false);
  const [sessionID, setSessionID] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [isActiveModule, setIsActiveModule] = useState(false);
  const [changeModuleUI, setChangeModuleUI] = useState(0);
  const [change, setChange] = useState(0);
  const [modalContinue, setModalContinue] = useState(false);
  const [exit, setExit] = useState(false);
  const [moduleStatus, setModuleStatus] = useState(false);
  const [disable, setDisable] = useState(false);
  const [connectionStatusFilter, setConnectionStatusFilter] = React.useState<
    number | undefined
  >(undefined);
  const [searchModuleID, setSearchModuleID] = useState<number | undefined>(
    undefined,
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [fingerOne, setFingerOne] = useState(false);
  const [fingerTwo, setFingerTwo] = useState(false);
  const [fingerPositionOne, setFingerPositionOne] = useState(false);
  const [fingerPositionTwo, setFingerPositionTwo] = useState(false);

  const [selectedFingers, setSelectedFingers] = useState<number[]>([]);

  const [haveFinger, sethaveFinger] = useState(false);

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );

  const length = selectedFingers.length;

  const [fingerprint1Description, setFingerprint1Description] =
    useState<string>('');
  const [fingerprint2Description, setFingerprint2Description] =
    useState<string>('');

  useEffect(() => {
    if (successMessage) {
      if (exit === false) message.success(successMessage.title);

      if (successMessage.title == 'Connect module successfully') {
        setSessionID(successMessage.result.sessionId);
      }
      setStatus('success');
      dispatch(clearModuleMessages());
    }
    if (failMessage && failMessage.data.error.title) {
      if (failMessage.data.error.title !== 'Cancel session failed') {
        message.error(`${failMessage.data.error.title}`);
      }
      setStatus('fail');
      dispatch(clearModuleMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  useEffect(() => {
    if (location.state && location.state.studentID) {
      setStudentID(location.state.studentID);
    }
  }, [location.state]);

  const autoConnectModule = useCallback(async () => {
    try {
      const arg = {
        ModuleID: moduleID,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
    } catch (error) {
      console.log('error at auto connect module', error);
    }
  }, [moduleID, token, dispatch]);

  const [next, setNext] = useState(false);

  const checkFingerID = useCallback(
    async (fingerId: number) => {
      try {
        if (fingerTwo === true) {
          if (length === 2) {
            if (selectedFingers.includes(fingerId)) {
              length - 1;
              setNext(true);
              setProgressStep1(3);
              setProgressStep2(1);
            }
          }
          if (next === true) {
            if (selectedFingers.includes(fingerId)) {
              setNext(false);
              setProgressStep2(3);
            }
          }
        } else if (fingerOne === true) {
          if (length === 1) {
            if (selectedFingers.includes(fingerId)) {
              setProgressStep1(3);
            }
          }
        }
      } catch (error) {
        console.log('error at auto connect module', error);
      }
    },
    [selectedFingers, length, next],
  );

  const modifyModuleConnection = useCallback(
    (moduleId: number, connectionStatus: number) => {
      const existedModule = moduleDetail.find((m) => m.moduleID === moduleId);
      if (existedModule) {
        existedModule.connectionStatus = connectionStatus;
        setModuleStatus(true);
      }
    },
    [moduleDetail],
  );

  const ConnectWebsocket = useCallback(() => {
    const ws = new WebSocket('wss://sams-project.com/ws/client', [
      'access_token',
      token,
    ]);
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      const message = JSON.parse(event.data);
      switch (message.Event) {
        case 'RegisterFingerSuccessfully': {
          const data = message.Data;
          const StudentID = data.StudentID;
          const fingerNumber = data.Finger;

          if (studentID == StudentID) {
            if (fingerNumber == 1) {
              setProgressStep1(3);
              setProgressStep2(1);
            } else if (fingerNumber == 2) {
              setProgressStep2(3);
            }
          }
          break;
        }
        case 'UpdateFingerSuccessfully': {
          const data = message.Data;
          const sessionId = data.SessionID;
          const studentId = data.StudentID;
          const fingerId = data.FingerID;
          console.log('sessionID', sessionID);
          checkFingerID(fingerId);
          console.log('finger', selectedFingers);

          break;
        }
        case 'ModuleConnected': {
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 1);
          if (moduleID === moduleId) {
            const specificModule = moduleDetail.find(
              (module) => module.moduleID === moduleId,
            );
            autoConnectModule()
              .then(() => {
                setModuleByID(specificModule as ModuleDetail | undefined);
                setModuleStatus(false);
              })
              .catch((error) => {
                console.log('Error in autoConnectModule:', error);
              });
          }
          setModuleDetail([...moduleDetail]);
          break;
        }
        case 'ModuleLostConnected': {
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 2);
          // setSessionID(0);
          if (moduleID === moduleId) {
            const specificModule = moduleDetail.find(
              (module) => module.moduleID === moduleId,
            );
            autoConnectModule()
              .then(() => {
                setModuleByID(specificModule as ModuleDetail | undefined);
                setModuleStatus(false);
              })
              .catch((error) => {
                console.log('Error in autoConnectModule:', error);
              });
          }
          setModuleDetail([...moduleDetail]);

          // setChange((prev) => prev + 1);

          // setTimeout(() => {

          break;
        }
        case 'CancelSession': {
          setModuleID(0);
          setStatus('');
          setModuleByID(undefined);
          setIsActiveModule(false);
          setSessionID(0);
          break;
        }

        default: {
          console.log('Undefined Event!');
          break;
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [
    token,
    studentID,
    moduleDetail,
    modifyModuleConnection,
    autoConnectModule,
    moduleID,
    sessionID,
    selectedFingers,
    checkFingerID,
  ]);

  useEffect(() => {
    ConnectWebsocket();
  }, [ConnectWebsocket]);

  const studentDetails = [
    { title: 'Student Name', value: student?.result.displayName || 'N/A' },
    { title: 'Student Code', value: student?.result.studentCode || 'N/A' },
    { title: 'Address', value: student?.result.address || 'N/A' },
    {
      title: 'Date Of Birth',
      value:
        (student?.result.dob &&
          moment(student?.result.dob, 'YYYY-MM-DD').format('DD/MM/YYYY')) ||
        'N/A',
    },
    { title: 'Email', value: student?.result.email || 'N/A' },
    { title: 'Phone Number', value: student?.result.phoneNumber || 'N/A' },
    // {
    //   title: 'Authenticated',
    //   value: student?.isAuthenticated ? 'true' : 'false',
    //   isAuthenticated: true,
    // },
  ];

  useEffect(() => {
    if (studentID !== '') {
      const response = StudentService.getStudentByID(studentID);

      response
        .then((data) => {
          // setStudent(data || undefined);
          // setStudentClass(data?.result.enrolledClasses || []);
          // setStudentFinger(data?.result.fingerprintTemplates || []);
          setStudent((prevStudent) => {
            if (JSON.stringify(prevStudent) !== JSON.stringify(data)) {
              return data || undefined;
            }
            return prevStudent;
          });
          setStudentClass((prevClasses) => {
            if (
              JSON.stringify(prevClasses) !==
              JSON.stringify(data?.result.enrolledClasses)
            ) {
              return data?.result.enrolledClasses || [];
            }
            return prevClasses;
          });
          const updatedFingerprints = (
            data?.result.fingerprintTemplates || []
          ).map((template, index) => ({
            ...template,
            fingerNumber: template.fingerNumber || index + 1, // Default to index + 1 if fingerNumber is missing
          }));
          setStudentFinger((prevFingers) => {
            if (
              JSON.stringify(prevFingers) !==
              JSON.stringify(data?.result.fingerprintTemplates)
            ) {
              // return data?.result.fingerprintTemplates || [];
              return updatedFingerprints;
            }
            return prevFingers;
          });
        })
        .catch((error) => {
          console.log('get student by id error: ', error);
        });
    }
  }, [studentID, change]);

  useEffect(() => {
    const response = ModuleService.getModuleByEmployeeID(employeeID ?? '');

    response
      .then((data) => {
        setModule(data || undefined);
        setModuleDetail(data?.result || []);
      })
      .catch((error) => {
        console.log('get module by id error: ', error);
      });
    setChangeModuleUI((prev) => prev + 1);
  }, [employeeID]);

  // const handleSearchClass = (value: string) => {
  //   setSearchInput(value);
  //   const filtered = student?.result.enrolledClasses.filter(
  //     (item) =>
  //       item.classCode &&
  //       item.classCode.toLowerCase().includes(value.toLowerCase()),
  //   );
  //   setFilteredSemesterClass(filtered ?? []);
  //   setIsUpdate(true);
  // };

  const handleSearchClass = (value: string) => {
    setSearchInput(value);

    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim(); // Trim leading and trailing spaces
    };

    const normalizedValue = normalizeString(value).toLowerCase();
    const filtered = student?.result.enrolledClasses.filter(
      (item) =>
        item.classCode &&
        normalizeString(item.classCode).toLowerCase().includes(normalizedValue),
    );

    setFilteredSemesterClass(filtered ?? []);
    setIsUpdate(true);
  };

  const activeModuleRegisterThree = async (
    moduleID: number,
    SessionId: number,
    registerMode: number,
  ): Promise<void> => {
    const RegisterMode = {
      StudentID: studentID,
      FingerRegisterMode: registerMode,
    };

    try {
      const data = await ModuleService.activeModuleModeRegister(
        moduleID,
        1,
        SessionId,
        RegisterMode,
        token,
      );
      console.log('Response data:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const activeModuleUpdateThree = async (
  //   moduleID: number,
  //   SessionId: number,
  //   registerMode: number,
  // ): Promise<void> => {
  //   const RegisterMode = {
  //     StudentID: studentID,
  //     FingerRegisterMode: registerMode,
  //   };

  //   try {
  //     const data = await ModuleService.activeModuleMode(
  //       moduleID,
  //       8,
  //       SessionId,
  //       RegisterMode,
  //       token,
  //     );
  //     console.log('Response data:', data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const activeModuleUpdateFinger = async (
    moduleID: number,
    SessionId: number,
    selectedFinger: number[],
  ): Promise<void> => {
    let finger1 = null;
    let finger2 = null;

    if (selectedFinger[0] !== undefined) {
      finger1 = selectedFinger[0];
    }
    if (selectedFinger[1] !== undefined) {
      finger2 = selectedFinger[1];
    }
    const UpdateMode = {
      StudentID: studentID,
      FingerprintTemplateId1: finger1,
      FingerprintTemplateId2: finger2,
    };

    try {
      const data = await ModuleService.activeModuleModeUpdate(
        moduleID,
        8,
        SessionId,
        UpdateMode,
        token,
      );
      console.log('Response data:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleModuleClick = async (moduleId: number, module: any) => {
    setLoading(true);
    setExit(false);
    setIsActiveModule(true);
    setModuleByID(module);
    if (moduleID === moduleId && sessionID === 0) {
      setModuleID(0);
      setStatus('');
      setModuleByID(undefined);
      setIsActiveModule(false);
      setLoading(false);
      dispatch(clearModuleMessages());
      console.log('1');
    } else if (moduleID === moduleId && sessionID !== 0) {
      const arg = {
        ModuleID: moduleId,
        Mode: 2,
        SessionId: sessionID,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      setModuleID(0);
      setStatus('');
      setSessionID(0);
      setModuleByID(undefined);
      setIsActiveModule(false);
      setLoading(false);
      dispatch(clearModuleMessages());
      console.log('2');
    } else if (moduleID !== moduleId) {
      if (sessionID > 0) {
        const args = {
          ModuleID: moduleID,
          Mode: 2,
          SessionId: sessionID,
          token: token,
        };
        await dispatch(activeModule(args) as any);
      }
      setModuleID(moduleId);
      const arg = {
        ModuleID: moduleId,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      setLoading(false);
      setDisable(false);
      setIsActiveModule(false);
      console.log('3');
    }
  };

  const LoadingIndicator = () => (
    <span className="loading-spinner">
      <Spin size="large" />
    </span>
  );

  const columns = [
    {
      key: '1',
      title: 'Class Code',
      dataIndex: 'classCode',
    },
    {
      key: '2',
      title: 'status',
      dataIndex: 'classStatus',
      render: (classStatus: number) => (
        <div>
          <Tag
            color={classStatus === 1 ? 'green' : classStatus === 2 ? 'red' : 'gray'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {classStatus === 1
              ? 'active'
              : classStatus === 2
              ? 'inactive'
              : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '3',
      title: 'Absence',
      dataIndex: 'absencePercentage',
      render: (absencePercentage: number) => (
        <div>
          <p
            style={{
              color:
                Number(absencePercentage) >= 20
                  ? 'red'
                  : Number(absencePercentage) < 20
                  ? 'green'
                  : 'gray',
            }}
          >
            {absencePercentage + '%'}
          </p>
        </div>
      ),
    },
  ];

  const handleConnectModule = async () => {
    if (exit === true) {
      const arg = {
        ModuleID: moduleID,
        Mode: 6,
        token: token,
      };

      try {
        await dispatch(activeModule(arg) as any);
      } catch (error) {
        console.error('Error dispatching activeModule:', error);
      }
    }
  };

  const showModalRegister = async () => {
    setDisable(true);
    setIsRegisterPressed(true);

    //   if(exit === true) {
    //   const arg = {
    //     ModuleID: moduleID,
    //     Mode: 6,
    //     token: token,
    //   };

    //   await dispatch(activeModule(arg) as any);
    // }

    if (modalContinue === false) {
      setProgressStep1(1);
      await activeModuleRegisterThree(moduleID, sessionID, 3);
      setExit(false);
      setIsModalVisible(true);
      setIsActiveModule(true);
      setDisable(false);
    } else {
      setIsModalVisible(true);
      setDisable(false);
    }
  };

  const showModalUpdate = async () => {
    setDisable(true);
    setIsUpdatePressed(true);

    try {
      // if (exit === true) {
      //   const arg = {
      //     ModuleID: moduleID,
      //     Mode: 6,
      //     token: token,
      //   };
      //   await dispatch(activeModule(arg) as any);
      // }

      if (modalContinue === false) {
        setProgressStep1(1);
        try {
          await activeModuleUpdateFinger(moduleID, sessionID, selectedFingers);
          setIsModalVisible(true);
          setDisable(false);
          setIsActiveModule(true);
          setExit(false);
        } catch (error) {
          console.error('Error in activeModuleUpdateThree:', error);
        }
      } else {
        setIsModalVisible(true);
        setDisable(false);
      }
    } catch (error) {
      console.error('Error in showModalUpdate:', error);
    }
  };

  const showModalModule = () => {
    setIsModalVisibleModule(true);
  };

  const handleOk = () => {
    setIsRegisterPressed(false);
    setIsUpdatePressed(false);
    setIsModalVisible(false);
    setProgressStep1(0);
    setProgressStep2(0);
    setModalContinue(false);
    if (fingerPositionOne === true) {
      setFingerprint1Description(studentFinger[0]?.description || '');
    } else {
      setFingerprint1Description('');
    }
    if (fingerPositionTwo === true) {
      setFingerprint2Description(studentFinger[1]?.description || '');
    } else {
      setFingerprint2Description('');
    }
  };

  const handleOkModule = () => {
    setIsModalVisibleModule(false);
  };

  useEffect(() => {
    localStorage.setItem('moduleID', moduleID.toString());
    localStorage.setItem('sessionID', sessionID.toString());
    localStorage.setItem('token', token.toString());
  }, [moduleID, sessionID, token]);

  const handleResetModule = async () => {
    const moduleID = Number(localStorage.getItem('moduleID'));
    const sessionID = Number(localStorage.getItem('sessionID'));
    const token = localStorage.getItem('token');
    try {
      const response = await ModuleService.cancelSession(
        moduleID,
        2,
        sessionID,
        token ?? '',
      );
      localStorage.removeItem('moduleID');
      localStorage.removeItem('sessionID');
      localStorage.removeItem('token');
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      handleResetModule();
    };
  }, []);

  const handleExit = async () => {
    if (fingerPositionOne === true) {
      setFingerprint1Description(studentFinger[0]?.description || '');
    } else {
      setFingerprint1Description('');
    }
    if (fingerPositionTwo === true) {
      setFingerprint2Description(studentFinger[1]?.description || '');
    } else {
      setFingerprint2Description('');
    }
    try {
      const response = await ModuleService.cancelSession(
        moduleID,
        2,
        sessionID,
        token,
      );

      // setModuleID(0);
      // setStatus('');
      // setModuleByID(undefined);
      setTimeout(async () => {
        const arg = {
          ModuleID: moduleID,
          Mode: 6,
          token: token,
        };

        await dispatch(activeModule(arg) as any);
        setIsRegisterPressed(false);
        setIsUpdatePressed(false);
        setIsActiveModule(false);
        setProgressStep1(0);
        setProgressStep2(0);
        setModalContinue(false);
        setExit(true);
        setIsModalVisible(false);
        message.success(response.title);
      }, 1000);
      return response;
    } catch (error: any) {
      message.error(error.errors);
      setModalContinue(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContinue(true);
    setIsActiveModule(false);
  };

  const handleCancelModule = () => {
    setIsModalVisibleModule(false);
  };

  const handleConfirmUpload = async () => {
    try {
      const response = await SessionServive.submitSession(
        sessionID,
        token,
        fingerprint1Description,
        fingerprint2Description,
      );

      const arg = {
        ModuleID: moduleID,
        Mode: 6,
        token: token,
      };

      await dispatch(activeModule(arg) as any);
      setIsModalVisible(false);
      setIsRegisterPressed(false);
      setIsUpdatePressed(false);
      setProgressStep1(0);
      setProgressStep2(0);
      setIsActiveModule(false);
      setModalContinue(false);
      message.success(response.title);
      setChange((prev) => prev + 1);
      return response;
    } catch (error: any) {
      console.error('Error uploading fingerprint:', error);
      message.error(error.errors);
    }
  };

  const renderProgress = (step: number) => {
    switch (step) {
      case 1:
        return <Spin />;
      case 2:
        return <Spin />;
      case 3:
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      default:
        return null;
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fingerprintScanAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const onlineDot = {
    loop: true,
    autoplay: true,
    animationData: onlineDots,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  // const fingerSelected = (fingerID: number) => {
  //   let newFingers;
  //   if (selectedFingers.includes(fingerID)) {
  //     newFingers = selectedFingers.filter((fingerId) => fingerId !== fingerID);
  //   } else {
  //     newFingers = [...selectedFingers, fingerID];
  //   }
  //   setSelectedFingers(newFingers);
  //   sethaveFinger(newFingers.length > 0);
  //   if (newFingers.length === 1) {
  //     setFingerOne(true);
  //     setFingerTwo(false);
  //   } else if (newFingers.length === 2) {
  //     setFingerOne(false);
  //     setFingerTwo(true);
  //   } else if (newFingers.length === 0) {
  //     setFingerOne(false);
  //     setFingerTwo(false);
  //   }
  // };

  const fingerSelected = (fingerID: number) => {
    let newFingers;
    if (selectedFingers.includes(fingerID)) {
      newFingers = selectedFingers.filter((fingerId) => fingerId !== fingerID);
    } else {
      newFingers = [...selectedFingers, fingerID];
    }
    setSelectedFingers(newFingers);
    sethaveFinger(newFingers.length > 0);
    if (newFingers.length === 1) {
      setFingerOne(true);
      setFingerTwo(false);
    } else if (newFingers.length === 2) {
      setFingerOne(false);
      setFingerTwo(true);
    } else if (newFingers.length === 0) {
      setFingerOne(false);
      setFingerTwo(false);
    }

    const fingerTemplates = studentFinger || [];
    const fingerOneID = fingerTemplates.find(
      (template) => template.fingerNumber === 1,
    )?.fingerprintTemplateID;
    const fingerTwoID = fingerTemplates.find(
      (template) => template.fingerNumber === 2,
    )?.fingerprintTemplateID;

    if (fingerOneID !== undefined && newFingers.includes(fingerOneID)) {
      setFingerPositionOne(true);
      setFingerprint1Description(fingerTemplates[0]?.description || '');
    } else {
      setFingerPositionOne(false);
      setFingerprint1Description('');
    }

    if (fingerTwoID !== undefined && newFingers.includes(fingerTwoID)) {
      setFingerPositionTwo(true);
      setFingerprint2Description(fingerTemplates[1]?.description || '');
    } else {
      setFingerPositionTwo(false);
      setFingerprint2Description('');
    }

    if (newFingers.length === 0) {
      setFingerPositionOne(false);
      setFingerPositionTwo(false);
    }
  };

  console.log('finger1', fingerprint1Description);
  console.log('finger2', fingerprint2Description);

  const getFingerOptions = () => {
    const fingerData = [
      { value: 'Left Thumb', label: 'Left Thumb' },
      { value: 'Left Index Finger', label: 'Left Index Finger' },
      { value: 'Left Middle Finger', label: 'Left Middle Finger' },
      { value: 'Left Ring Finger', label: 'Left Ring Finger' },
      { value: 'Left Pinky Finger', label: 'Left Pinky Finger' },
      { value: 'Right Thumb', label: 'Right Thumb' },
      { value: 'Right Index Finger', label: 'Right Index Finger' },
      { value: 'Right Middle Finger', label: 'Right Middle Finger' },
      { value: 'Right Ring Finger', label: 'Right Ring Finger' },
      { value: 'Right Pinky Finger', label: 'Right Pinky Finger' },
    ];

    return fingerData.map((finger) => (
      <Option key={finger.value} value={finger.value}>
        {finger.label}
      </Option>
    ));
  };

  return (
    <Content className={styles.accountStudentContent}>
      <ContentHeader
        contentTitle="Student"
        previousBreadcrumb={'Home / Account / Student / '}
        currentBreadcrumb={'Student Detail'}
        key={''}
      />
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={9}>
            <div>
              <div className={styles.imageContainer}>
                <img
                  src={student.result.avatar || personIcon}
                  alt="Student"
                  className={styles.studentImg}
                />
              </div>
            </div>
            <div></div>
          </Col>
          <Col span={15}>
            <Content>
              {/* <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Student Details</p>
              </AntHeader> */}

              {/* <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.studentDetailsTable}>
                      <tbody>
                        {studentDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.updateStudentTitle}>
                              {detail.title}
                            </td>
                            <td>
                              <p>{detail.value}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Content>
                </Content>
              </Col> */}
              <Col span={24}>
                <Card className={styles.card1}>
                  {studentDetails.map((detail, i) => (
                    <div key={`info_${i}`}>
                      <Row className={styles.rowDetails}>
                        <Col span={10}>
                          <div style={{ fontWeight: 500 }}>{detail.title}</div>
                        </Col>
                        <Col span={14}>
                          <div style={{ fontWeight: 500, color: '#667085' }}>
                            {detail.value}
                          </div>
                        </Col>
                      </Row>
                      <hr
                        style={{
                          borderColor: '#e6e7e9',
                          borderWidth: 0.5,
                        }}
                      />
                    </div>
                  ))}
                </Card>
              </Col>

              <Col></Col>
            </Content>
          </Col>
        </Row>

        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        >
          Fingerprints
        </Divider>

        <Row gutter={[16, 16]}>
          <Col span={9}>
            <div>
              <Col>
                <Row>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <div className={styles.moduleCard}>
                      <div className={styles.moduleImgCtn}>
                        <img
                          src={modules}
                          alt="Module image"
                          className={styles.moduleImg}
                        />
                      </div>
                      <div className={styles.moduleInfo}>
                        <span>
                          <b>ID: </b>
                          {moduleID > 0 && moduleID}
                        </span>
                        <span>
                          <b>Status: </b>
                          <p
                            style={{
                              display: 'inline',
                              color: moduleByID?.status
                                ? moduleByID?.status === 1
                                  ? 'green'
                                  : 'red'
                                : 'inherit',
                            }}
                          >
                            {moduleByID?.status === 1
                              ? 'Available'
                              : moduleByID?.status === 0
                              ? 'Unavailable'
                              : ''}
                          </p>
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <b>Connect: </b>
                          {moduleByID?.connectionStatus === 1 ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <div style={{ marginRight: -5 }}>
                                <Lottie
                                  options={onlineDot}
                                  height={30}
                                  width={30}
                                />
                              </div>
                              <div style={{ marginBottom: 2 }}>online</div>
                            </div>
                          ) : moduleByID?.connectionStatus === 2 ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: 5,
                              }}
                            >
                              <Badge status="error" /> offline
                            </div>
                          ) : null}
                        </span>

                        <span>
                          <b>Mode: </b>
                          <p style={{ display: 'inline' }}>
                            {moduleByID?.mode === 1
                              ? 'Register'
                              : moduleByID?.mode === 2
                              ? 'Attendance'
                              : ''}
                          </p>
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Button
                    style={{
                      width: '100%',
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                    type="primary"
                    block
                    onClick={() => {
                      showModalModule();
                    }}
                    disabled={disable}
                  >
                    <p>Select Module</p>
                  </Button>
                </Row>
                {student.result.fingerprintTemplates.length === 0 && (
                  <Row>
                    <Button
                      style={{ width: '100%', marginBottom: 10 }}
                      type="primary"
                      block
                      onClick={() => {
                        showModalRegister();
                        // activeModuleRegisterThree(moduleID, 3);
                      }}
                      disabled={
                        isActiveModule ||
                        !moduleID ||
                        status === 'fail' ||
                        !sessionID ||
                        disable
                      }
                    >
                      <p>Register Fingerprints</p>
                    </Button>
                  </Row>
                )}
                {student.result.fingerprintTemplates.length > 0 && (
                  <Row>
                    <Button
                      disabled={
                        isActiveModule ||
                        !moduleID ||
                        status === 'fail' ||
                        !sessionID ||
                        disable ||
                        !haveFinger
                      }
                      onClick={() => showModalUpdate()}
                      style={{ width: ' 100%', marginTop: 5 }}
                    >
                      Update Fingerprints
                    </Button>
                  </Row>
                )}
                <Modal
                  title="Select Module"
                  visible={isModalVisibleModule}
                  onOk={handleOkModule}
                  onCancel={handleCancelModule}
                  width={500}
                  footer={[
                    <Button key="cancel" onClick={handleCancelModule}>
                      Exit
                    </Button>,
                  ]}
                >
                  <Row style={{ marginTop: 20 }}>
                    <Card style={{ width: '100%' }}>
                      <Row gutter={[16, 16]}>
                        <Col span={14}>
                          <p style={{ fontWeight: 500 }}>
                            Module Connecting:{' '}
                            {moduleID > 0 && <span>{moduleID}</span>}
                          </p>
                        </Col>

                        <Col span={10}>
                          <p style={{ fontWeight: 500 }}>
                            Status:
                            {loading && <LoadingIndicator />}
                            {status === 'success' && (
                              <span style={{ color: 'green' }}>Connected</span>
                            )}
                            {status === 'fail' && (
                              <span style={{ color: 'red' }}>Fail</span>
                            )}
                          </p>
                        </Col>
                      </Row>
                    </Card>
                    <Content className="module_cards" style={{ marginTop: 5 }}>
                      <Row gutter={[16, 16]} style={{ marginBottom: 5 }}>
                        <Col span={18}>
                          <Input
                            placeholder="Search by Module ID"
                            type="number"
                            onChange={(e) =>
                              setSearchModuleID(
                                Number(e.target.value) || undefined,
                              )
                            }
                          />
                        </Col>
                        <Col span={6}>
                          <Select
                            defaultValue=""
                            style={{ width: '100%' }}
                            onChange={(e) =>
                              setConnectionStatusFilter(Number(e) || undefined)
                            }
                          >
                            <Option value={''}>All</Option>
                            <Option value={'1'}>Online</Option>
                            <Option value={'2'}>Offline</Option>
                          </Select>
                        </Col>
                      </Row>
                      {moduleDetail.length === 0 ? (
                        <Empty description="No modules available" />
                      ) : (
                        <Card style={{ height: 400, overflowY: 'auto' }}>
                          {moduleDetail
                            .filter(
                              (item) =>
                                (connectionStatusFilter === undefined ||
                                  item.connectionStatus ===
                                    connectionStatusFilter) &&
                                (searchModuleID === undefined ||
                                  item.moduleID === searchModuleID),
                            )
                            .sort(
                              (a, b) => a.connectionStatus - b.connectionStatus,
                            )
                            .map((item, index) => (
                              <Button
                                onClick={() =>
                                  handleModuleClick(item.moduleID, item)
                                }
                                key={index}
                                className={`${styles.unselectedModule} ${
                                  moduleID === item.moduleID
                                    ? styles.selectedModule
                                    : ''
                                }`}
                                disabled={isActiveModule || modalContinue}
                              >
                                <Row>
                                  <Col span={3} style={{ marginRight: 80 }}>
                                    <p className={styles.upTitle}>
                                      Module {item.moduleID}
                                    </p>
                                    <br />
                                    <img
                                      src={moduleImg}
                                      alt="module"
                                      style={{ width: 45, height: 45 }}
                                    />
                                  </Col>
                                  <Col span={3}>
                                    <p>
                                      {item.mode === 1 ? (
                                        <p>
                                          Mode:{' '}
                                          <span style={{ fontWeight: 'bold' }}>
                                            Register
                                          </span>
                                        </p>
                                      ) : item.mode === 2 ? (
                                        <p>
                                          Mode:{' '}
                                          <span style={{ fontWeight: 'bold' }}>
                                            Attendance
                                          </span>
                                        </p>
                                      ) : null}
                                    </p>
                                    <p className={styles.upDetail}>
                                      {item.status === 1 ? (
                                        <p style={{ color: 'blue' }}>
                                          available
                                        </p>
                                      ) : item.status === 2 ? (
                                        <p style={{ color: 'red' }}>
                                          unavailable
                                        </p>
                                      ) : null}
                                    </p>
                                    <p className={styles.upDetail}>
                                      {item.connectionStatus === 1 ? (
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: -10,
                                          }}
                                        >
                                          <div style={{ marginRight: 5 }}>
                                            <Lottie
                                              options={onlineDot}
                                              height={30}
                                              width={30}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: -10,
                                              marginBottom: 3,
                                            }}
                                          >
                                            online
                                          </div>
                                        </div>
                                      ) : item.connectionStatus === 2 ? (
                                        <>
                                          <Badge status="error" /> offline
                                        </>
                                      ) : null}
                                    </p>
                                  </Col>
                                </Row>
                              </Button>
                            ))}
                        </Card>
                      )}
                    </Content>
                  </Row>
                </Modal>
              </Col>
            </div>
          </Col>
          <Col span={15}>
            <Card style={{ width: '100%' }}>
              {studentFinger.length === 0 ? (
                <Empty description="Student have no fingerprint data" />
              ) : (
                <Row gutter={[5, 5]}>
                  {studentFinger.map((item, index) => (
                    <Col span={12}>
                      <Card
                        onClick={() => {
                          if (!modalContinue) {
                            fingerSelected(item.fingerprintTemplateID);
                          }
                        }}
                        key={index}
                        className={
                          selectedFingers.includes(item.fingerprintTemplateID)
                            ? styles.selectedFinger
                            : styles.unselectedFinger
                        }
                      >
                        <div className="card-row">
                          <div className="card-icon">
                            <BsFingerprint size={30} />
                          </div>
                          <div className="card-content">
                            <div className="card-status">
                              <b>Status: </b>
                              <span
                                style={{
                                  color:
                                    item.status === 1
                                      ? 'green'
                                      : item.status === 2
                                      ? 'red'
                                      : 'inherit',
                                }}
                              >
                                {item.status === 1
                                  ? 'Available'
                                  : item.status === 2
                                  ? 'Unavailable'
                                  : ''}
                              </span>
                            </div>
                            <div className="card-timestamp">
                              <b>Timestamp: </b>
                              <span>
                                {new Date(item.createdAt).toLocaleDateString(
                                  'en-GB',
                                  {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  },
                                )}
                              </span>
                            </div>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </Card>

                      {/* <Button
                          disabled={
                            isActiveModule ||
                            !moduleID ||
                            status === 'fail' ||
                            !sessionID ||
                            disable
                          }
                          onClick={() => {
                            if (index === 0) {
                              setFingerTwo(null);
                              setFingerOne(item.fingerprintTemplateID);
                            } else if (index === 1) {
                              setFingerOne(null);
                              setFingerTwo(item.fingerprintTemplateID);
                            }
                            showModalUpdate();
                          }}
                          style={{ width: ' 100%', marginTop: 5 }}
                        >
                          Update Fingerprint {index + 1}
                        </Button> */}
                    </Col>
                  ))}
                </Row>
              )}
            </Card>
          </Col>
        </Row>

        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        >
          Class
        </Divider>

        <Card className={styles.cardHeader}>
          <Content>
            <AntHeader className={styles.tableHeader}>
              <p className={styles.tableTitle}>
                Class of {student.result.displayName}
              </p>
              <Row gutter={[16, 16]}>
                <Col>
                  <Input
                    placeholder="Search by class code"
                    suffix={<CiSearch />}
                    variant="filled"
                    value={searchInput}
                    onChange={(e) => handleSearchClass(e.target.value)}
                  ></Input>
                </Col>
              </Row>
            </AntHeader>
          </Content>
        </Card>
        <Table
          columns={columns}
          dataSource={(!isUpdate ? studentClass : filteredSemesterClass).map(
            (item, index) => ({
              key: index,
              classCode: item.classCode || 'N/A',
              classStatus: item.classStatus,
              absencePercentage: item.absencePercentage,
            }),
          )}
          pagination={{
            showSizeChanger: true,
          }}
        ></Table>
      </Card>
      <Modal
        title={
          isRegisterPressed
            ? 'Register Fingerprint'
            : isUpdatePressed
            ? 'Update Fingerprint'
            : 'Fingerprint Registration'
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        // bodyStyle={{ minHeight: '300px' }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              Modal.confirm({
                title: 'Confirm Cancel',
                content: 'Are you sure you want to cancel progress?',
                onOk: handleExit,
              });
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: 'Confirm Submission',
                content: 'Are you sure you want to submit the fingerprint?',
                onOk: handleConfirmUpload,
              });
            }}
            // disabled={progressStep2 !== 3}
          >
            Submit
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          {isRegisterPressed && (
            <Col span={24}>
              <Col style={{ textAlign: 'center', marginBottom: 60 }}>
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <Col span={18}>
                    <Lottie options={defaultOptions} height={100} width={100} />
                    <p>Registering Fingerprint Template 1...</p>
                    {renderProgress(progressStep1)}
                  </Col>
                  {/* <Col span={6}>
                    <Select
                      placeholder="Select Finger"
                      onChange={(value) => setFingerprint1Description(value)}
                      style={{ width: '100%' }}
                    >
                      {getFingerOptions()}
                    </Select>
                  </Col> */}
                </Row>
              </Col>
              {(progressStep2 === 1 || progressStep2 === 3) && (
                <Col style={{ textAlign: 'center' }}>
                  <Row style={{ display: 'flex', alignItems: 'center' }}>
                    <Col span={18}>
                      <Lottie
                        options={defaultOptions}
                        height={100}
                        width={100}
                      />
                      <p>Registering Fingerprint Template 2...</p>
                      {renderProgress(progressStep2)}
                    </Col>
                    {/* <Col span={6}>
                      <Select
                        placeholder="Select Finger"
                        onChange={(value) => setFingerprint2Description(value)}
                        style={{ width: '100%' }}
                      >
                        {getFingerOptions()}
                      </Select>
                    </Col> */}
                  </Row>
                </Col>
              )}
            </Col>
          )}
          {isUpdatePressed && fingerTwo && (
            <Col span={24}>
              <Col style={{ textAlign: 'center', marginBottom: 60 }}>
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <Col span={18}>
                    <Lottie options={defaultOptions} height={100} width={100} />
                    <p>Update Fingerprint Template 1...</p>
                    {renderProgress(progressStep1)}
                  </Col>
                  {/* <Col span={6}>
                    <Select
                      value={fingerprint1Description}
                      placeholder="Select Finger"
                      onChange={(value) => setFingerprint1Description(value)}
                      style={{ width: '100%' }}
                    >
                      {getFingerOptions()}
                    </Select>
                  </Col> */}
                </Row>
              </Col>
              {(progressStep2 === 1 || progressStep2 === 3) && (
                <Col style={{ textAlign: 'center' }}>
                  <Row style={{ display: 'flex', alignItems: 'center' }}>
                    <Col span={18}>
                      <Lottie
                        options={defaultOptions}
                        height={100}
                        width={100}
                      />
                      <p>Update Fingerprint Template 2...</p>
                      {renderProgress(progressStep2)}
                    </Col>
                    {/* <Col span={6}>
                      <Select
                        value={fingerprint2Description}
                        placeholder="Select Finger"
                        onChange={(value) => setFingerprint2Description(value)}
                        style={{ width: '100%' }}
                      >
                        {getFingerOptions()}
                      </Select>
                    </Col> */}
                  </Row>
                </Col>
              )}
            </Col>
          )}
          {isUpdatePressed && fingerOne && (
            <Col span={24}>
              <Col style={{ textAlign: 'center', marginBottom: 60 }}>
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <Col span={18}>
                    <Lottie options={defaultOptions} height={100} width={100} />
                    {fingerPositionOne ? (
                      <p>Update Fingerprint Template 1...</p>
                    ) : fingerPositionTwo ? (
                      <p>Update Fingerprint Template 2...</p>
                    ) : null}
                    {renderProgress(progressStep1)}
                  </Col>
                  {/* <Col span={6}>
                    {fingerPositionOne ? (
                      <Select
                        value={fingerprint1Description}
                        placeholder="Select Finger"
                        onChange={(value) => setFingerprint1Description(value)}
                        style={{ width: '100%' }}
                      >
                        {getFingerOptions()}
                      </Select>
                    ) : fingerPositionTwo ? (
                      <Select
                        value={fingerprint2Description}
                        placeholder="Select Finger"
                        onChange={(value) => setFingerprint2Description(value)}
                        style={{ width: '100%' }}
                      >
                        {getFingerOptions()}
                      </Select>
                    ) : null}
                  </Col> */}
                </Row>
              </Col>
            </Col>
          )}
        </Row>
      </Modal>
    </Content>
  );
};

export default AccountStudentsDetail;
