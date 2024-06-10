import { EventProps } from 'react-big-calendar'
import styles from '../index.module.less'
import '../../../../assets/styles/styles.less'
import React from 'react'
import { CustomEvent as RBC_Event } from '../../../../models/calendar/CustomEvent';


const CustomEventDay: React.FC<EventProps<RBC_Event>> = ({ event }) => {
    const classDetail = event.title.split('-');
    const statusColor = event.status == 'past' ? '#64748B' : (event.status == 'current' ? '#24D164' : '#FBBF24');
    const isActive = event.status === 'current';

    const detail = {
        subject: classDetail[0],
        room: classDetail[1],
    }

    return (
        <div className={styles.eventCtnItem}>
            <div className={styles.eventTitleDay}>
                <div className={`${styles.circleStatus} item-justify-center`} style={{ backgroundColor: statusColor }}>
                    {isActive ? (
                        <div className={styles.wave} style={{
                            backgroundColor: statusColor,
                        }}></div>
                    ) : ('')}
                </div>
                <div className={styles.titleTxtDay}>
                    <div>Subject: {detail.subject}</div>
                    <div>Class: {event.classCode}</div>
                    <div>Room: {detail.room}</div>
                </div>
            </div>
            <div className={styles.eventTimeDay}>{event.slot}</div>
        </div>
    )
}

export default CustomEventDay