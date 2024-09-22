import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Input, Layout, Row, Table, Tag } from 'antd';
import styles from './Module.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import type { Module, ModuleDetail } from '../../../models/module/Module';
import { ModuleService } from '../../../hooks/Module';
import { IoMdInformation } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { RootState } from '../../../redux/Store';
import { useSelector } from 'react-redux';
import onlineDots from '../../../assets/animations/Online_Dot.json';
import Lottie from 'react-lottie';

const { Header: AntHeader } = Layout;

interface ModuleProps {
  moduleId: number;
  connection: boolean;
}

const Module: React.FC<ModuleProps> = ({moduleId, connection}) => {
  const userDetail = useSelector((state: RootState) => state.auth.userDetail);
  const [module, setModule] = useState<ModuleDetail[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredModules, setFilteredModules] =
    useState<ModuleDetail[]>(module);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = (moduleID: number) => {
    navigate(`/module/module-detail`, {
      state: { moduleID: moduleID },
    });
  };

  console.log('connect', connection);

  const handleSearchModule = (value: string) => {
    setSearchInput(value);

    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const normalizedValue = normalizeString(value).toLowerCase();

    const filtered = module.filter((item) => {
      const normalizedModule = item.moduleID
        ? normalizeString(item.moduleID.toString()).toLowerCase()
        : '';
      const normalizedOwnerName = item.employee.displayName
        ? normalizeString(item.employee.displayName).toLowerCase()
        : '';
      return (
        normalizedModule.includes(normalizedValue) ||
        normalizedOwnerName.includes(normalizedValue)
      );
    });

    setFilteredModules(filtered);
    setIsUpdate(true);
  };

  const columns = [
    {
      key: '1',
      title: 'Module',
      dataIndex: 'moduleID',
    },
    {
      key: '2',
      title: 'Status',
      dataIndex: 'status',
      render: (status: number) => (
        <div>
          <Tag
            color={status === 1 ? 'green' : status === 2 ? 'red' : 'gray'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {status === 1 ? 'Available' : status === 2 ? 'Unavailable' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '3',
      title: 'Mode',
      dataIndex: 'mode',
      render: (mode: number) => (
        <div>
          <Tag
            color={mode === 1 ? 'green' : mode === 2 ? 'blue' : 'gray'}
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              textAlign: 'center',
            }}
          >
            {mode === 1 ? 'Register' : mode === 2 ? 'Attendance' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '4',
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      key: '5',
      title: 'Connection',
      dataIndex: 'connection',
    },
    {
      key: '6',
      title: 'Using',
      dataIndex: 'using',
    },
    {
      key: '7',
      title: 'Info',
      dataIndex: 'info',
      render: (moduleID: number) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(moduleID);
            }}
            shape="circle"
            style={{ border: 'none' }}
          >
            <span>
              <IoMdInformation size={25} />
            </span>
          </Button>
        </div>
      ),
    },
    // {
    //   key: '4',
    //   title: 'Register',
    //   dataIndex: 'register',
    //   render: (_: any, record: Student) => (
    //     <div>
    //       {record.isAuthenticated ? (
    //         <Button
    //           shape="circle"
    //           style={{ border: 'none', backgroundColor: 'white' }}
    //           disabled
    //         >
    //           <FaFingerprint size={20} />
    //         </Button>
    //       ) : (
    //         <Button shape="circle" style={{ border: 'none' }}>
    //           <FaFingerprint size={20} />
    //         </Button>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  const onlineDot = {
    loop: true,
    autoplay: true,
    animationData: onlineDots,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    if (connection === true) {
      const existedModule = module.find((m) => m.moduleID === moduleId);
      if (existedModule) {
        existedModule.connectionStatus = 1;
      }
      setModule([...module])
    } else if (connection === false) {
      const existedModule = module.find((m) => m.moduleID === moduleId);
      if (existedModule) {
        existedModule.connectionStatus = 2;
      }
      setModule([...module])
    }
  }, [moduleId, connection]);

  useEffect(() => {
    if (userDetail && userDetail.result?.role.name === 'Admin') {
      const response = ModuleService.getAllModule();

      response
        .then((data) => {
          setModule(data?.result || []);
        })
        .catch((error) => {
          console.log('get module error: ', error);
        });
    }

    if (userDetail && userDetail.result?.role.name === 'Lecturer') {
      const response = ModuleService.getModuleByEmployeeID(
        userDetail.result.employeeID,
      );

      response
        .then((data) => {
          setModule(data?.result || []);
        })
        .catch((error) => {
          console.log('get module error: ', error);
        });
    }
  }, []);

  return (
    <Content className={styles.moduleContent}>
      <div>
        <ContentHeader
          contentTitle="Module"
          previousBreadcrumb={'Home / '}
          currentBreadcrumb={'Module'}
          key={''}
        />
        {/* <SetUpWifi /> */}
      </div>
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Modules</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchModule(e.target.value)}
                ></Input>
              </Col>
            </Row>
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(!isUpdate ? module : filteredModules).map(
          (item, index) => ({
            key: index,
            moduleID: item.moduleID || 'N/A',
            status: item.status,
            mode: item.mode,
            owner: item.employee.displayName || 'N/A',
            connection: (
              <>
                {item.connectionStatus === 1 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: -5
                    }}
                  >
                    <div style={{ marginRight: -8 }}>
                      <Lottie options={onlineDot} height={30} width={30} />
                    </div>
                    <div style={{ marginBottom: 2 }}>{' '}Online</div>
                  </div>
                ) : item.connectionStatus === 2 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 5,
                      gap: 4
                    }}
                  >
                    <Badge status="error" />{' '}Offline
                  </div>
                ) : null}
              </>
            ),
            using: (
              <>
                {item.using === 2 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft:-5,
                      color:'green'
                    }}
                  >
                    Not use
                  </div>
                ) : item.using === 1 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 5,
                      color:'red'
                    }}
                  >
                    In Use
                  </div>
                ) : null}
              </>
            ),
            info: item.moduleID,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      // onRow={(record) => ({
      //   onClick: () => handleRowClick(record.moduleID),
      // })}
      ></Table>
    </Content>
  );
};

export default Module;
