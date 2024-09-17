import { EventProps } from 'react-big-calendar'
import styles from '../index.module.less'
import '../../../../assets/styles/styles.less'
import React from 'react'
import { CustomEvent as RBC_Event } from '../../../../models/calendar/CustomEvent';

const CustomEvent: React.FC<EventProps<RBC_Event>> = ({ event }) => {
    console.log("Event in customevent ", event);
    const classDetail = event.title.split('-');
    const statusColor = event.status == 'past' ? '#64748B' : (event.status == 'current' ? '#24D164' : '#FBBF24');
    const isActive = event.status === 'current';

    return (
        <div className={styles.eventCtnItem}>
            <div className={styles.eventTitle}>
                <div className={`${styles.circleStatus} item-justify-center`} style={{ backgroundColor: statusColor }}>
                    {isActive ? (
                        <div className={styles.wave} style={{
                            backgroundColor: statusColor,
                        }}></div>
                    ) : ('')}
                </div>
                <div className={styles.titleTxt}>
                    {event.classCode} <br />
                    Ro.{classDetail[1]}
                </div>
            </div>
            <div className={styles.eventTime}>{event.slot}</div>
        </div>
    )
}

export default CustomEvent