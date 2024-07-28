import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import { Button, Card, Layout, Table } from 'antd';
import styles from './Module.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import type { Module, ModuleDetail } from '../../../models/module/Module';
import { ModuleService } from '../../../hooks/Module';
import { IoMdInformation } from 'react-icons/io';

const { Header: AntHeader } = Layout;

const Module: React.FC = () => {
  const [module, setModule] = useState<ModuleDetail[]>([]);
//   const [searchInput, setSearchInput] = useState('');
//   const [filteredSlots, setFilteredSlots] = useState<Slot[]>(slot);
//   const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = (moduleID: number) => {
    navigate(`/module/module-detail`, {
      state: { moduleID: moduleID },
    });
  };

  const columns = [
    {
      key: '1',
      title: 'Module',
      dataIndex: 'moduleID',
    },
    {
        key: '2',
        title: 'status',
        dataIndex: 'status',
        render: (status: boolean) => (
          <div>
            <p style={{ color: status ? 'green' : 'red' }}>
              {status ? 'true' : 'false'}
            </p>
          </div>
        ),
      },
    {
      key: '3',
      title: 'Mode',
      dataIndex: 'mode',
    },
    {
      key: '4',
      title: 'Prepare Time',
      dataIndex: 'preparedTime',
    },
    {
      key: '5',
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
            <span><IoMdInformation size={25}/></span>
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

  useEffect(() => {
    const response = ModuleService.getAllModule();

    response
      .then((data) => {
        setModule(data?.result || []);
      })
      .catch((error) => {
        console.log('get module error: ', error);
      });
  }, []);



  return (
    <Content className={styles.moduleContent}>
      <ContentHeader
        contentTitle="Module"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Module'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Modules</p>
            {/* <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name or code"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchStudent(e.target.value)}
                ></Input>
              </Col>
            </Row> */}
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(module).map(
          (item, index) => ({
            key: index,
            moduleID: item.moduleID,
            status: item.status,
            mode: item.mode,
            preparedTime: item.preparedTime,
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
