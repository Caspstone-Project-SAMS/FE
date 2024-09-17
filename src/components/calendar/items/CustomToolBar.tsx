import React, { useCallback, useEffect, useState } from 'react'
import styles from './index.module.less'
import { CalendarOutlined, CaretLeftOutlined, CaretRightOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space, Spin, Typography } from 'antd'
import { ToolbarProps, Views } from 'react-big-calendar'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/Store'
import { FaAngleDown } from 'react-icons/fa6'
import { Semester } from '../../../models/calendar/Semester'

interface WeekDay {
    weekday: string;
    date: string;
}

type props = {
    toolbar: ToolbarProps,
    loadingStatus: boolean,
    semesters: Semester[],
    selectedSemester: number
    setSelectedSemester: React.Dispatch<React.SetStateAction<number>>,
}

const { Text } = Typography;

const CustomToolBar: React.FC<props> = ({ toolbar, loadingStatus, semesters, selectedSemester, setSelectedSemester }) => {
    const [selectedView, setSelectedView] = useState<string>('Week');
    const [dateTitle, setDateTitle] = useState<string>();

    const calendar = useSelector((state: RootState) => state.calendar)
    const userDetail = useSelector((state: RootState) => state.auth.userDetail);

    const [semesterData, setSemesterData] = useState<MenuProps['items']>([]);
    const [labelSemester, setLabelSemester] = useState<string>('')

    const { onView, view } = toolbar;
    // console.log("toolbar props: ", toolbar);
    const items = [
        {
            key: '1',
            id: Views.MONTH,
            label: 'Month',
        },
        {
            key: '2',
            id: Views.WEEK,
            label: 'Week',
        },
        {
            key: '3',
            id: Views.DAY,
            label: 'Day',
        },
        {
            key: '4',
            id: Views.AGENDA,
            label: 'Agenda',
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const selectedItem = items.find(item => item.key === e.key);
        if (selectedItem) {
            const label = selectedItem.label;
            toolbar.onView(selectedItem.id);
            setSelectedView(label as string);
        }
    };

    // const onSearch = (value: string) => {
    //     // console.log("searching ", value);
    //     const lecturerID = userDetail?.result?.id;
    //     if (lecturerID) {
    //         const arg = { lecturerID: lecturerID, semesterID: '5' };
    //         dispatch(getScheduleByID(arg))
    //     }
    // }

    const updateDateTitle = useCallback(() => {
        const label = toolbar.label
        setDateTitle(label);
    }, [])

    const handleFormatSemester = (semester: Semester[]) => {
        const menuData: MenuProps['items'] = []

        if (semester && semester.length > 0) {
            semester.forEach((item, i) => {
                if (item.semesterID === selectedSemester) {
                    setSelectedSemester(item.semesterID);
                    setLabelSemester(item.semesterCode);
                }
                menuData.push({
                    key: item.semesterID,
                    style: { padding: 0 },
                    label: (
                        <Text style={{
                            display: 'flex',
                            width: '100%',
                            padding: '6px',
                        }}>
                            {item.semesterCode}
                        </Text>
                    ),
                })
            })
            setSemesterData(menuData);
        }
    }
    const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        try {
            setSelectedSemester(Number(key));
            setLabelSemester(domEvent.target.innerHTML)
        } catch (error) {
            console.log("Err key type");
        }
    };

    useEffect(() => {
        updateDateTitle()

        if (semesters && semesters.length > 0) {
            handleFormatSemester(semesters);
        }
    }, [])

    useEffect(() => {
        const fmtTxt = view.replace(/^\w/, char => char.toUpperCase())
        setSelectedView(fmtTxt)
        updateDateTitle()

        // const day = toolbar.date;
        // console.log("toolbar ", toolbar);
        // console.log("formated: ", getWeekFromDate(day));
    }, [toolbar, view, updateDateTitle])

    return (
        <div className={styles.toolbarCtn}>
            <div className={styles.left}>
                <CalendarOutlined
                    className={styles.calendarIcon}
                    style={{ fontSize: '24px' }}
                />
                <div className={styles.date}>
                    {dateTitle}
                </div>
                <Dropdown menu={{
                    items,
                    selectable: true,
                    defaultSelectedKeys: ['2'],
                    selectedKeys: [selectedView],
                    onSelect: (e) => handleMenuClick(e),
                }}
                >
                    <Button>
                        <Space>
                            {selectedView}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div className={styles.right}>
                {/* <Search
                    placeholder="Search"
                    allowClear
                    onChange={() => {
                        console.log("calendar state ", calendar);
                    }}
                    onSearch={onSearch}
                    style={{
                        width: 200,
                        marginRight: '8px'
                    }}
                /> */}
                <div style={{ marginRight: 10, gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Text >Semester:</Text>
                    <Dropdown
                        trigger={['click']}
                        menu={{ items: semesterData, onClick }}>
                        <Button
                            icon={<FaAngleDown />}
                            iconPosition='end'
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                width: 'fit-content'
                            }}
                        >
                            <Text>
                                {labelSemester}
                            </Text>
                        </Button>
                    </Dropdown>
                </div>
                <Spin spinning={loadingStatus}>
                    <Button
                        type="default"
                        icon={<CaretLeftOutlined />}
                        size={'middle'}
                        onClick={() => toolbar.onNavigate("PREV")}
                        className={styles.prevBtn}
                    >
                        Prev
                    </Button>
                    <Button
                        type="default"
                        icon={<CaretRightOutlined />}
                        iconPosition='end' size={'middle'}
                        onClick={() => {
                            toolbar.onNavigate("NEXT")
                        }}
                        className={styles.nextBtn}
                    >
                        Next
                    </Button>
                </Spin>
            </div>
        </div>
    )
}

export default CustomToolBar