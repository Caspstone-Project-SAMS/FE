import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import { Card, Layout, Table, Tag } from 'antd';
import styles from './Slot.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import type { Slot } from '../../../models/slot/Slot';
import { SlotService } from '../../../hooks/Slot';

const { Header: AntHeader } = Layout;

const Slot: React.FC = () => {
  const [slot, setSlot] = useState<Slot[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  //   const [searchInput, setSearchInput] = useState('');
  //   const [filteredSlots, setFilteredSlots] = useState<Slot[]>(slot);
  //   const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      key: '1',
      title: 'Slot Number',
      dataIndex: 'slotnumber',
    },
    {
      key: '2',
      title: 'Order',
      dataIndex: 'order',
    },
    {
      key: '3',
      title: 'status',
      dataIndex: 'slotstatus',
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
      key: '4',
      title: 'Start Time',
      dataIndex: 'starttime',
    },
    {
      key: '5',
      title: 'End Time',
      dataIndex: 'endtime',
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

  const handlePagination = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }

  const handleRowClick = (slotID: number) => {
    navigate(`/slot/slot-detail`, {
      state: { slotID: slotID },
    });
  };

  useEffect(() => {
    const response = SlotService.getAllSlot();

    response
      .then((data) => {
        setSlot(data || []);
        // setFilteredSlots(data || []);
      })
      .catch((error) => {
        console.log('get slot error: ', error);
      });
  }, []);

  //   const handleSearchSlot = (value: string) => {
  //     setSearchInput(value);
  //     const filtered = slot.filter(
  //       (item) =>
  //         (item.slotNumber &&
  //           item.slotNumber.toLowerCase().includes(value.toLowerCase())) 
  //     );
  //     setFilteredStudents(filtered);
  //     setIsUpdate(true);
  //   };

  return (
    <Content className={styles.slotContent}>
      <ContentHeader
        contentTitle="Slot"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Slot'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}
              onClick={() => {
                SlotService.getSlotByPage(2)
              }}
            >Slots</p>
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
        dataSource={(slot).map(
          (item, index) => ({
            key: index,
            slotnumber: item.slotNumber,
            order: item.order,
            slotstatus: item.status,
            starttime: item.startTime,
            endtime: item.endtime,
            slotID: item.slotID
          }),
        )}
        pagination={{
          showSizeChanger: true
        }}
      // onRow={(record) => ({
      //   onClick: () => handleRowClick(record.slotID),
      // })}
      ></Table>
    </Content>
  );
};

export default Slot;
