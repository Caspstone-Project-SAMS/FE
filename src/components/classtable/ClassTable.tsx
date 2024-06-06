// import React, { useState } from "react";
// import { Layout, Table, Typography } from "antd";
// import "./ClassTable.css";
// import Search from "antd/es/input/Search";
// import { Content } from "antd/es/layout/layout";
// import { EditOutlined } from "@ant-design/icons";
// import { DataType } from "../../models/CLass";// Adjust the path as needed

// const { Header: AntHeader } = Layout;

// const ClassTable: React.FC = () => {
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
//   const [dataSource] = useState<DataType[]>([]);

//   for (let i = 0; i < 46; i++) {
//     dataSource.push({
//       key: i,
//       day: `Monday`,
//       subject: `MLN122`,
//       room: `312`,
//       slot: 1,
//       classcode: `NJS1611`,
//       specialized: `SE`,
//       groupsize: 32,
//     });
//   }

//   const columns = [
//     {
//       key: "1",
//       title: "Day",
//       dataIndex: "day",
//     },
//     {
//       key: "2",
//       title: "Subject",
//       dataIndex: "subject",
//     },
//     {
//       key: "3",
//       title: "Room",
//       dataIndex: "room",
//     },
//     {
//       key: "4",
//       title: "Slot",
//       dataIndex: "slot",
//     },
//     {
//       key: "5",
//       title: "Class code",
//       dataIndex: "classcode",
//     },
//     {
//       key: "6",
//       title: "Specialized",
//       dataIndex: "specialized",
//     },
//     {
//       key: "7",
//       title: "Group size",
//       dataIndex: "groupsize",
//     },
//     {
//       key: "8",
//       title: "Action",
//       render: (record: DataType) => {
//         return (
//           <>
//             <EditOutlined onClick={() => console.log('Editing:', record)} />
//           </>
//         );
//       },
//     },
//   ];

//   const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
//     setSelectedRowKeys(newSelectedRowKeys);
//   };

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: onSelectChange,
//   };

//   return (
//     <Content className="class-content">
//       <AntHeader className="class-header">
//         <Typography.Title level={3} style={{ marginTop: 5 }}>
//           Class
//         </Typography.Title>
//         <Search
//           placeholder="input search text"
//           allowClear
//           // onSearch={onSearch}
//           style={{
//             width: 200,
//             display: "flex",
//           }}
//         />
//       </AntHeader>
//       <Table
//         columns={columns}
//         dataSource={dataSource}
//         pagination={{ pageSize: 7 }}
//         rowSelection={rowSelection}
//       ></Table>
//     </Content>
//   );
// };

// export default ClassTable;

import React, { useState } from 'react';
import { Layout, Table, Typography } from 'antd';
import './ClassTable.css';
import Search from 'antd/es/input/Search';
import { Content } from 'antd/es/layout/layout';
import { EditOutlined } from '@ant-design/icons';
import { DataType } from '../../models/CLass'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom

const { Header: AntHeader } = Layout;

const ClassTable: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource] = useState<DataType[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); // Default page size
  const navigate = useNavigate(); // Initialize useHistory hook

  for (let i = 0; i < 46; i++) {
    dataSource.push({
      key: i,
      day: `Monday`,
      subject: `MLN122`,
      room: `312`,
      slot: 1,
      classcode: `NJS1611`,
      specialized: `SE`,
      groupsize: 32,
    });
  }

  const columns = [
    {
      key: '1',
      title: 'Day',
      dataIndex: 'day',
    },
    {
      key: '2',
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      key: '3',
      title: 'Room',
      dataIndex: 'room',
    },
    {
      key: '4',
      title: 'Slot',
      dataIndex: 'slot',
    },
    {
      key: '5',
      title: 'Class code',
      dataIndex: 'classcode',
    },
    {
      key: '6',
      title: 'Specialized',
      dataIndex: 'specialized',
    },
    {
      key: '7',
      title: 'Group size',
      dataIndex: 'groupsize',
    },
    {
      key: '8',
      title: 'Action',
      render: (record: DataType) => {
        return (
          <>
            <EditOutlined onClick={() => navigate('/class/classdetails')} />{' '}
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
    <Content className="class-content">
      <AntHeader className="class-header">
        <Typography.Title level={3} style={{ marginTop: 5 }}>
          Class
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
        rowSelection={rowSelection}
      ></Table>
    </Content>
  );
};

export default ClassTable;
