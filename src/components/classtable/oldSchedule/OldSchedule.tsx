import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Input, Layout, Row, Skeleton, Table, Tag } from 'antd';
import styles from './index.module.less'
import { Content } from 'antd/es/layout/layout';
import { CiSearch } from 'react-icons/ci';
import moment from 'moment';
import { CalendarService } from '../../../hooks/Calendar';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import useDispatch from '../../../redux/UseDispatch';
import { getAllSemester } from '../../../redux/slice/global/GlobalSemester';
import { Schedule } from '../../../models/calendar/Schedule';
import { ColumnsType } from 'antd/es/table';
import { InfoCircleOutlined, InfoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

interface ScheduleExtend extends Schedule {
    status: 'past' | 'current' | 'future'
}
interface FormattedSchedule {
    room: string;
    slot: string;
    status: 'past' | 'current' | 'future';
    classCode: string;
    scheduleID: number;
    subjectCode: string;
    start: Date,
    end: Date
}

const OldSchedule = () => {
    // const [scheduleList, setScheduleList] = useState([]);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.userDetail?.result?.id)
    const semesters = useSelector((state: RootState) => state.globalSemester.data)

    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [currentSemester, setCurrentSemester] = useState(2);
    const [oldSchedules, setOldSchedules] = useState<Schedule[]>([]);
    const [filterSchedules, setFilterSchedules] = useState<Schedule[]>([]);


    const handleSearchClass = useCallback(
        (value: string) => {
            setSearchInput(value);

            const normalizeString = (str: string) => {
                return str
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            };

            const normalizedValue = normalizeString(value).toLowerCase();

            const filtered = oldSchedules.filter((item) => {
                const normalizedClassCode = item.classCode
                    ? normalizeString(item.classCode).toLowerCase()
                    : '';

                return (
                    normalizedClassCode.includes(normalizedValue)
                );
            });

            setFilterSchedules(filtered);
            setIsSearch(true);
        },
        [oldSchedules],
    );

    const fetchOldSchedules = (semester: number) => {
        const prev5 = moment().subtract(5, 'days').format('YYYY-MM-DD');
        const prev1 = moment().subtract(1, 'days').format('YYYY-MM-DD');

        if (userId && semester) {
            setIsLoading(true);
            const getPromise = CalendarService.getScheduleByDay(
                userId,
                semester,
                prev5,
                prev1,
            );
            getPromise.then(data => {
                console.log("This is the last 5 data ", data);
                setOldSchedules([...data]);
            }).catch(err => {
                if (axios.isAxiosError(err) && err.response)
                    console.log("err when get old schedule");
            }).finally(() => setIsLoading(false))
        }
    }

    const formatCurUpClass = (obj: Schedule): FormattedSchedule => {
        //   des slot status classCode scheduleID subjectCode
        const startDateTime = new Date(`${obj.date}T${obj.startTime}`);
        const endDateTime = new Date(`${obj.date}T${obj.endTime}`);
        const status = obj.scheduleStatus === 1 ? ('future') : obj.scheduleStatus === 2 ? ('current') : ('past')
        return {
            room: obj.roomName,
            slot: `Slot ${obj.slotNumber}`,
            start: startDateTime,
            end: endDateTime,
            status: status,
            classCode: obj.classCode,
            scheduleID: obj.scheduleID,
            subjectCode: obj.subjectCode
        };
    }

    const columns: ColumnsType<Schedule> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (value, record: Schedule) => {
                const fmtDate = moment(record.date, 'YYYY-MM-DD', true).format('DD/MM/YYYY');
                return (
                    <div>
                        {fmtDate}
                    </div>
                )
            },
            sorter: (a, b) => {
                try {
                    const fmtPrevious = moment(a.date, 'YYYY-MM-DD', true).unix()
                    const fmtLater = moment(b.date, 'YYYY-MM-DD', true).unix()
                    return fmtPrevious - fmtLater;
                } catch (error) {
                    return 0
                }
            },
            defaultSortOrder: 'descend',
        },
        {
            title: 'Class',
            dataIndex: 'classCode',
            key: 'classCode',
        },
        {
            title: 'Subject',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
        },
        {
            title: 'Room',
            dataIndex: 'roomName',
            key: 'roomName',
        },
        {
            title: 'Slot',
            dataIndex: 'slotNumber',
            key: 'slotNumber',
        },
        {
            title: 'Attended Student',
            dataIndex: 'attendStudent',
            key: 'attendStudent',
        },
        {
            title: 'Attend Class',
            dataIndex: 'attended',
            key: 'attended',
            render: ((value, record: Schedule) => {
                return (
                    <>
                        {
                            record.attended === 2 ? (
                                <Tag color="green">Attended</Tag>
                            ) : (
                                <Tag color="red">Not Attended</Tag>
                            )
                        }
                    </>
                )
            })
        },
        {
            key: 'details',
            title: 'Detail',
            render: (value, record: Schedule) => {
                const event = formatCurUpClass(record)
                return (
                    <Button
                        icon={<InfoOutlined />}
                        shape="circle"
                        onClick={() => navigate('/class/classdetails', { state: { event } })}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        if (semesters && semesters.length === 0) {
            dispatch(getAllSemester());
        } else {
            fetchOldSchedules(currentSemester)
        }
    }, [])

    useEffect(() => {
        semesters.forEach(item => {
            if (item.semesterStatus === 2 && item.semesterID) {
                setCurrentSemester(item.semesterID);
            }
        })
        fetchOldSchedules(currentSemester);
    }, [semesters])

    useEffect(() => {
        setFilterSchedules(oldSchedules)
    }, [oldSchedules])

    return (
        <div style={{ padding: 20 }}>
            <Card className={styles.cardHeader}>
                <Content>
                    <AntHeader className={styles.tableHeader}>
                        <p className={styles.tableTitle}>Old Schedule (Last 5 days)</p>
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
            {
                isLoading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                ) : (
                    <Table dataSource={isSearch ? filterSchedules : oldSchedules} columns={columns} />
                )
            }
        </div>
    )
}

export default OldSchedule