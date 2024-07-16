import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { CalendarOutlined, CaretLeftOutlined, CaretRightOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import Search from 'antd/es/input/Search'
import { ToolbarProps, Views } from 'react-big-calendar'
import useDispatch from '../../../redux/UseDispatch'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/Store'
import { getScheduleByID } from '../../../redux/slice/Calendar'
import moment from 'moment'

interface WeekDay {
    weekday: string;
    date: string;
}

const CustomToolBar: React.FC<ToolbarProps> = (toolbar) => {
    const [selectedView, setSelectedView] = useState<string>('Week');
    const [dateTitle, setDateTitle] = useState<string>();

    const calendar = useSelector((state: RootState) => state.calendar)
    const userDetail = useSelector((state: RootState) => state.auth.userDetail);

    const dispatch = useDispatch();

    const { onView, view } = toolbar
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

    const onSearch = (value: string) => {
        // console.log("searching ", value);
        const lecturerID = userDetail?.result?.id;
        if (lecturerID) {
            const arg = { lecturerID: lecturerID, semesterID: '2' };
            dispatch(getScheduleByID(arg))
        }
    }

    const updateDateTitle = () => {
        const label = toolbar.label
        setDateTitle(label);
    }

    const getWeekFromDate = (inputDate: Date): WeekDay[] => {
        const startOfWeek = moment(inputDate).startOf('week');
        const week: WeekDay[] = [];

        for (let i = 0; i < 7; i++) {
            const date = moment(startOfWeek).add(i, 'days').format('YYYY-MM-DD');
            week.push({
                weekday: moment(date).format('ddd'),
                date: date,
            });
        }

        return week;
    };

    useEffect(() => {
        // onView('week');
        updateDateTitle()
    }, [])

    useEffect(() => {
        const fmtTxt = view.replace(/^\w/, char => char.toUpperCase())
        setSelectedView(fmtTxt)
        updateDateTitle()

        console.log("Toolbar ", toolbar);
        const day = toolbar.date;
        console.log("Day: ", day);
        console.log("formated: ", getWeekFromDate(day));
        console.log("Date title ", dateTitle);
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
                <Search
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
                />
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
                    onClick={() => toolbar.onNavigate("NEXT")}
                    className={styles.nextBtn}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default CustomToolBar