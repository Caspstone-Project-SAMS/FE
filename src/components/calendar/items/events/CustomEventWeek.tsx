import React from 'react'
import styles from '../index.module.less'
import '../../../../assets/styles/styles.less'
import { EventProps } from 'react-big-calendar'
import { CustomEvent as RBC_Event } from '../../../../models/calendar/CustomEvent'

const CustomWeekEvent: React.FC<EventProps<RBC_Event>> = ({ event }) => {
    const classDetail = event.title.split('-');
    const statusColor = event.status == 'past' ? '#64748B' : (event.status == 'current' ? '#24D164' : '#FBBF24');
    const isActive = event.status === 'current';

    return (
        <div className={styles.weekEventCtn}>
            <div className={styles.eventTitle}>
                <div className={styles.titleTxt}>
                    {classDetail[0]} <br />
                    {classDetail[1]} <br />
                    {event.class}
                </div>
                <div className={styles.eventSub}>
                    <div className={`${styles.circleStatus} item-justify-center`} style={{ backgroundColor: statusColor }}>
                        {isActive ? (
                            <div className={styles.wave} style={{ backgroundColor: statusColor }}></div>
                        ) : ('')}
                    </div>
                    <div className={styles.eventTime}>{event.slot}</div>
                </div>
            </div>
        </div>
    )
}

export default CustomWeekEvent