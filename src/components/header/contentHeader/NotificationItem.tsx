import React from 'react'
import styles from './index.module.less'
import { Avatar, Typography } from 'antd'

type props = {
    image?: string,
    info: string,
    time: string,
    date: string
}

const UserList = ['SAMS'];
const ColorList = [
    '#f56a00', //orange
    '#7265e6',
    '#ffbf00',
    '#00a2ae'
];

const { Text } = Typography

const NotificationItem: React.FC<props> = ({ info, time, image, date }) => {
    return (
        <div className={styles.notiItemCtn}>
            <div className={styles.imageCtn}>
                <Avatar style={{ backgroundColor: ColorList[0], verticalAlign: 'middle' }} size="large" gap={4}>
                    SAMS
                </Avatar>
            </div>
            <div className={styles.notiDetailCtn}>
                <Text >
                    YOU haven't checking attendance at FAP system class MLN301-NJS1602
                    Please make an action!!
                </Text>
                <Text className={styles.time}>
                    <Text>Today</Text>{' '}at 7:30 AM
                </Text>
            </div>
        </div>
    )
}

export default NotificationItem