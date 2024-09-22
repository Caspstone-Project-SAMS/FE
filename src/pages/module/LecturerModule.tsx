import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Input, Layout, Row, Table, Tag } from 'antd';
import styles from './index.module.less';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import type { Module, ModuleDetail } from '../../models/module/Module';
import { ModuleService } from '../../hooks/Module';
import { IoMdInformation } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

const { Header: AntHeader } = Layout;

const LecturerModule: React.FC = () => {
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
      render: (status: boolean) => (
        <div>
          <Tag
            color={status ? 'green' : 'red'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {status ? 'active' : 'inactive'}
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
            color={mode === 1 ? 'green' : 'blue'}
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              textAlign: 'center',
            }}
          >
            {mode === 1 ? 'Register' : 'Attendance'}
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
  ];

  useEffect(() => {
    if (userDetail && userDetail.result?.employeeID) {
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
            mode: item.mode || 'N/A',
            owner: item.employee.displayName || 'N/A',
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

export default LecturerModule;
