import React from 'react'
import './index.less'
import { CalendarOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space } from 'antd'

const CustomToolBar: React.FC = () => {
    const items: MenuProps['items'] = [
        {
            label: '1st menu item',
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: '2nd menu item',
            key: '2',
            icon: <UserOutlined />,
        },
        {
            label: '3rd menu item',
            key: '3',
            icon: <UserOutlined />,
            danger: true,
        },
        {
            label: '4rd menu item',
            key: '4',
            icon: <UserOutlined />,
            danger: true,
            disabled: true,
        },
    ];


    const handleMenuClick: MenuProps['onClick'] = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
    };
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        message.info('Click on left button.');
        console.log('click left button', e);
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <div className='toolbar-ctn'>
            <div className='left'>
                <CalendarOutlined />
                <div>
                    <b>May</b> 2024
                </div>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            Button
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <div className='right'>

            </div>
        </div>
    )
}

export default CustomToolBar