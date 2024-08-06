import React, { ReactElement, useEffect, useState } from 'react'
import styles from '../Class.module.less'
import { Content } from 'antd/es/layout/layout'
import { Button, Card, Col, Input, Layout, Row, Table, TableColumnsType, Typography } from 'antd';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { CiSearch } from 'react-icons/ci';
import { PlusOutlined } from '@ant-design/icons';
import { FiCheck } from 'react-icons/fi';
import { IoIosMore } from 'react-icons/io';
import { CgClose } from 'react-icons/cg';
import { AttendanceService } from '../../../hooks/Attendance';
import toast from 'react-hot-toast';
import moment from 'moment';
import { AttendanceRecord } from '../../../models/attendance/AttendanceReport';

interface DataType {
    key: React.Key;
    name: string;
    absentPercent: number;
    attendanceStatus: ReactElement;
}

interface ReportItem {
    key: React.Key;
    name: string;
    studentCode: string;
    absentPercent: number;
    attendanceStatus: ReactElement;
}

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography

const AttendanceStatus: React.FC<{ status: number }> = ({ status }) => {
    //0: not_yet, 1: attended, 2: absent
    const color = status === 0
        ? (styles.notYetColor)
        : (
            status === 1 ? (styles.attendedColor) : (styles.absentColor)
        );
    return (
        <div className={`${styles.statusIcon} ${color}`}>
            {
                status === 1 ? (
                    <FiCheck size={18} color='#FFF' />
                ) : (
                    status === 2 ? (
                        <CgClose size={18} color='#FFF' />
                    ) : (
                        <IoIosMore size={18} color='#FFF' />
                    )
                )
            }
        </div>
    )
}

const columns: TableColumnsType<ReportItem> = [
    {
        title: 'Students name',
        width: 200,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
    },
    {
        title: 'Code',
        width: 100,
        dataIndex: 'studentCode',
        key: 'studentCode',
        fixed: 'left',
    },
    {
        title: 'Absent',
        width: 100,
        dataIndex: 'absentPercent',
        key: 'absentPercent',
        fixed: 'left',
        sorter: true,
    },
    // { title: '19/02', dataIndex: 'attendanceStatus', key: '1' },
    // { title: '20/02', dataIndex: 'attendanceStatus', key: '2' },
    // {
    //     title: 'Action',
    //     key: 'operation',
    //     fixed: 'right',
    //     width: 100,
    //     render: () => <a>action</a>,
    // },
];

const data: ReportItem[] = [
    {
        key: '1',
        name: 'John Brown',
        absentPercent: 20,
        studentCode: 'SE123',
        attendanceStatus: <AttendanceStatus status={0} key={1} />,
    },
    {
        key: '2',
        name: 'Jim Green',
        absentPercent: 18,
        studentCode: 'SE123',
        attendanceStatus: <AttendanceStatus status={1} key={2} />,
    },
];

const ClassReport = () => {
    const [searchInput, setSearchInput] = useState('');
    const [classes, setClasses] = useState<[]>([]);
    const [filteredClass, setFilteredClass] = useState<[]>(classes);

    const [colDatas, setColDatas] = useState<TableColumnsType<ReportItem>>(columns);
    const [rowDatas, setRowDatas] = useState<any[]>([]);
    // const handleSearchClass = (value: string) => {
    //     setSearchInput(value);

    //     const normalizeString = (str: string) => {
    //         return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    //     };

    //     const normalizedValue = normalizeString(value).toLowerCase();

    //     const filtered = classes.filter((item) => {
    //         const normalizedClassCode = item.classCode
    //             ? normalizeString(item.classCode).toLowerCase()
    //             : '';
    //         const normalizedLecturerName = item.lecturer.displayName
    //             ? normalizeString(item.lecturer.displayName).toLowerCase()
    //             : '';
    //         const normalizedSemesterCode = item.semester.semesterCode
    //             ? normalizeString(item.semester.semesterCode).toLowerCase()
    //             : '';

    //         return (
    //             normalizedClassCode.includes(normalizedValue) ||
    //             normalizedLecturerName.includes(normalizedValue) ||
    //             normalizedSemesterCode.includes(normalizedValue)
    //         );
    //     });

    //     setFilteredClass(filtered);
    // };

    const hasDifferentSlots = (records: AttendanceRecord[]): boolean => {
        const dateSlotMap = new Map<string, Set<number>>();

        records.forEach(record => {
            if (!dateSlotMap.has(record.date)) {
                dateSlotMap.set(record.date, new Set());
            }
            dateSlotMap.get(record.date)!.add(record.slotNumber);
        });

        for (let slots of dateSlotMap.values()) {
            if (slots.size > 1) {
                return true;
            }
        }

        return false;
    };

    useEffect(() => {
        // setColDatas(columns);
        // setRowDatas([]);
        const promise = AttendanceService.getClassAttendanceReportByID(5);
        promise.then(data => {
            console.log("Got this data ", data);
            data.forEach((item, index) => {
                const isDifferentSlotInDay = hasDifferentSlots(item.attendanceRecords)
                const rowData: any = {
                    key: `row_${index}`,
                    name: item.studentName,
                    studentCode: item.studentCode,
                    absentPercent: item.absencePercentage,
                    // attendanceStatus: item
                };

                item.attendanceRecords.forEach((item, i) => {
                    //Set collumn datas
                    if (index === 0) {
                        const date = moment(item.date, 'YYYY-MM-DD', true).format('DD/MM');
                        console.log("Date of api ", item.date, 'date', date);
                        const titleCol = isDifferentSlotInDay ? `${date}-(${item.slotNumber})` : `${date}`
                        const col = {
                            title: titleCol,
                            dataIndex: `date_${i}`,
                            key: `date_${i}`,
                        };
                        setColDatas(prev => [...prev, col]);
                    }
                    rowData[`date_${i}`] = <AttendanceStatus status={item.slotNumber} key={`status_${index}-${i}`} />
                });
                console.log('Row data => ', rowData);

                setRowDatas(prev => [...prev, rowData])
            })
            console.log("this is col ", colDatas);
            console.log("this is row ", rowDatas);
        }).catch(err => {
            toast.error('Unexpected error occured.')
        })


    }, [])

    return (
        <Content className={styles.classReportCtn}>
            <div>
                <ContentHeader
                    contentTitle='Class Report'
                    currentBreadcrumb='Report'
                    previousBreadcrumb='Class / '
                />
            </div>
            <Card className={styles.cardHeader}>
                <Content>
                    <AntHeader className={styles.tableHeader}>
                        <p className={styles.tableTitle}>NJS1602</p>
                        <Row gutter={[16, 16]}>
                            <Col>
                                <Input
                                    placeholder="Search by name"
                                    suffix={<CiSearch />}
                                    variant="filled"
                                    value={searchInput}
                                // onChange={(e) => handleSearchClass(e.target.value)}
                                ></Input>
                            </Col>
                            <Col>
                                <Button
                                    // onClick={showModalCreate}
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
            <div style={{
                //  width: '60%'
            }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 1300 }}
                />
            </div>
        </Content>
    )
}

export default ClassReport