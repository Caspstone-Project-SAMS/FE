import { EventProps } from 'react-big-calendar'
import '../index.less'
import '../../../../assets/styles/styles.less'
import React from 'react'
import { CustomEvent as RBC_Event } from '../../../../models/calendar/CustomEvent';

const CustomEvent: React.FC<EventProps<RBC_Event>> = ({ event }) => {
    const classDetail = event.title.split('-');
    const statusColor = event.status == 'past' ? '#64748B' : (event.status == 'current' ? '#24D164' : '#FBBF24');
    const isActive = event.status === 'current';

    return (
        <div className='event-ctn-item'>
            <div className='event-title'>
                <div className='circle-status item-justify-center' style={{ backgroundColor: statusColor }}>
                    {isActive ? (
                        <div className='wave' style={{ backgroundColor: statusColor }}></div>
                    ) : ('')}
                </div>
                <div className='title_txt'>
                    {classDetail[0]} <br />
                    {classDetail[1]}
                </div>
            </div>
            <div className='event-time'>{event.slot}</div>
        </div>
    )
}

export default CustomEvent