import React, { useState } from 'react';
import { Layout, Table, Typography } from 'antd';
import styles from './ClassDetail.module.less';
import Search from 'antd/es/input/Search';
import { Content } from 'antd/es/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { ClassDetail } from '../../models/ClassDetail'; // Adjust the path as needed
import DetailClassTable from './data/DetailClassTable';
import { IoIosCheckmark } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { LiaFingerprintSolid } from 'react-icons/lia';

const { Header: AntHeader } = Layout;

const ClassDetailTable: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource] = useState<ClassDetail[]>(DetailClassTable());
  const [pageSize, setPageSize] = useState<number>(10); // Default page size

  const columns = [
    {
      key: '1',
      title: 'Student name',
      dataIndex: 'studentname',
    },
    {
      key: '2',
      title: 'Student code',
      dataIndex: 'studentcode',
    },
    {
      key: '3',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: '4',
      title: 'Status',
      dataIndex: 'status',
      render: (text: string) => (
        <span
          style={{
            color:
              text === 'Not yet'
                ? '#fbbf24'
                : text === 'Attended'
                ? 'green'
                : 'red',
          }}
        >
          {text}
        </span>
      ),
      filters: [
        {
          text: 'Not yet',
          value: 'Not yet',
        },
        {
          text: 'Attended',
          value: 'Attended',
        },
        {
          text: 'Absent',
          value: 'Absent',
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      key: '5',
      title: 'Fingerprint status',
      dataIndex: 'fingerprintstatus',
      render: (text: string) => (
        <span style={{ color: text === 'authenticated' ? 'green' : 'red' }}>
          {text === 'authenticated' ? (
            <IoIosCheckmark style={{ fontSize: '30px' }} />
          ) : (
            <RxCross2 style={{ color: 'red', fontSize: '24px' }} />
          )}
        </span>
      ),
      filters: [
        {
          text: 'authenticated',
          value: 'authenticated',
        },
        {
          text: 'unauthenticated',
          value: 'unauthenticated',
        },
      ],
      onFilter: (value, record) => record.fingerprintstatus.indexOf(value) === 0,
    },
    {
      key: '6',
      title: 'Check attendance',
      render: (record: ClassDetail) => {
        return (
          <>
            <LiaFingerprintSolid style={{ fontSize: '24px' }} />
          </>
        );
      },
    },
    {
      key: '7',
      title: 'Register',
      render: (record: ClassDetail) => {
        return (
          <>
            {record.fingerprintstatus === 'unauthenticated' && <EditOutlined />}
          </>
        );
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <Content className={styles.classDetailContent}>
      <AntHeader className={styles.classDetailHeader}>
        <Typography.Title level={3} style={{ marginTop: 5 }}>
          Student
        </Typography.Title>
        <Search
          placeholder="input search text"
          allowClear
          style={{
            width: 200,
            display: 'flex',
          }}
        />
      </AntHeader>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: handlePageSizeChange,
          pageSizeOptions: ['5', '10', '15', '20'],
          className: 'pagination-center', // Apply custom class here
        }}
        showSorterTooltip={{
          target: 'sorter-icon',
        }}
        // rowSelection={rowSelection}
      ></Table>
    </Content>
  );
};

export default ClassDetailTable;
