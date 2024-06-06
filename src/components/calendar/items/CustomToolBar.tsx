import React, { useState } from 'react'
import styles from './index.module.less'
import { CalendarOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space, Typography } from 'antd'
import Search from 'antd/es/input/Search'

const CustomToolBar: React.FC = () => {
    const [selectedView, setSelectedView] = useState<string>('Week');

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Month',
        },
        {
            key: '2',
            label: 'Week',
        },
        {
            key: '3',
            label: 'Day',
        },
    ];


    return (
        <div className={styles.toolbarCtn}>
            <div className={styles.left}>
                <CalendarOutlined
                    className={styles.calendarIcon}
                    style={{ fontSize: '24px' }}
                />
                <div className={styles.date}>
                    <b>May</b> 2024
                </div>
                <Dropdown menu={{
                    items,
                    selectable: true,
                    defaultSelectedKeys: ['2'],
                    onSelect: (info) => {
                        const key = Number(info.key)
                        // setSelectedView(items[key])
                    }
                }}
                >
                    <Button>
                        <Space>
                            Selectable
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div className={styles.right}>
                <Search
                    placeholder="Search"
                    allowClear
                    // onSearch={onSearch}
                    style={{
                        width: 200,
                    }}
                />
            </div>
        </div>
    )
}

export default CustomToolBar