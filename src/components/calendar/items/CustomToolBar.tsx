import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { CalendarOutlined, CaretLeftOutlined, CaretRightOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import Search from 'antd/es/input/Search'
import { ToolbarProps, Views } from 'react-big-calendar'

const CustomToolBar: React.FC<ToolbarProps> = (toolbar) => {
    const [selectedView, setSelectedView] = useState<string>('Week');
    const [dateTitle, setDateTitle] = useState<string>();

    const { onView } = toolbar
    console.log("toolbar props: ", toolbar);
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
        const selectedItem = items.find(item => item?.key === e.key);
        if (selectedItem) {
            const label = selectedItem.label;
            toolbar.onView(selectedItem.id);
            setSelectedView(label as string);
        }
    };

    const onSearch = (value: string) => {
        console.log("searching ", value);
    }

    const updateDateTitle = () => {
        const label = toolbar.label
        setDateTitle(label);
    }

    useEffect(() => {
        onView('week');
        updateDateTitle()
    }, [])

    useEffect(() => {
        updateDateTitle()
    }, [selectedView, toolbar])



    return (
        <div className={styles.toolbarCtn}>
            <div className={styles.left}>
                <CalendarOutlined
                    className={styles.calendarIcon}
                    style={{ fontSize: '24px' }}
                />
                <div className={styles.date}>
                    {dateTitle}
                    {/* <b>May</b> 2024 */}
                </div>
                <Dropdown menu={{
                    items,
                    selectable: true,
                    defaultSelectedKeys: ['2'],
                    onSelect: (e) => handleMenuClick(e)
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