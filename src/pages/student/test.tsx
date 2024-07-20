import React from "react";
import { Table, TableColumnType, Layout } from "antd";
import styles from "./Student.module.less"; // Adjust the import if necessary

const { Content } = Layout;

interface Attendance {
  date: string;
  status: string;
}

interface Slot {
  slotID: number;
  slotName: string;
  attendance: Attendance[];
}

interface Semester {
  semesterID: number;
  semesterName: string;
  slots: Slot[];
}

const semestersData: Semester[] = [
  {
    semesterID: 1,
    semesterName: "Spring 2023",
    slots: [
      {
        slotID: 1,
        slotName: "Slot 1",
        attendance: [
          { date: "2023-01-10", status: "Present" },
          { date: "2023-01-12", status: "Absent" },
        ],
      },
      {
        slotID: 2,
        slotName: "Slot 2",
        attendance: [
          { date: "2023-01-15", status: "Present" },
          { date: "2023-01-17", status: "Present" },
        ],
      },
    ],
  },
  {
    semesterID: 2,
    semesterName: "Fall 2023",
    slots: [
      {
        slotID: 3,
        slotName: "Slot 1",
        attendance: [
          { date: "2023-09-10", status: "Present" },
          { date: "2023-09-12", status: "Present" },
        ],
      },
      {
        slotID: 4,
        slotName: "Slot 2",
        attendance: [
          { date: "2023-09-15", status: "Absent" },
          { date: "2023-09-17", status: "Present" },
        ],
      },
    ],
  },
];

const Student: React.FC = () => {
  const columns: TableColumnType<any>[] = [
    {
      title: "Semester",
      dataIndex: "semesterName",
      key: "semesterName",
      render: (text: string, record: any) => record.semesterName || record.slotName || record.date,
    },
    {
      title: "Slot",
      dataIndex: "slotName",
      key: "slotName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const expandedRowRender = (record: any) => {
    if (record.slots) {
      return (
        <Table
          columns={columns.slice(1)} // Skip the first column
          dataSource={record.slots}
          rowKey="slotID"
          pagination={false}
          expandable={{
            expandedRowRender: (slotRecord) => (
              <Table
                columns={columns.slice(2)} // Skip the first two columns
                dataSource={slotRecord.attendance}
                rowKey="date"
                pagination={false}
              />
            ),
            rowExpandable: (slotRecord) => slotRecord.attendance.length > 0,
          }}
        />
      );
    }
    return null;
  };

  return (
    <Content className={styles.accountClassContent}>
      <Table
        columns={columns}
        dataSource={semestersData}
        rowKey="semesterID"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.slots.length > 0,
        }}
        pagination={false}
      />
    </Content>
  );
};

export default Student;
