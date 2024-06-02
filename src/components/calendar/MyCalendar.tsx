import React from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import './MyCalendar.less'
import 'react-big-calendar/lib/sass/styles.scss'
import events from './events'
import { slots } from './RawData'

const localizer = momentLocalizer(moment)

const backgroundEvents = [
    {
        id: 0,
        title: 'Available for Clients',
        start: new Date(2024, 6, 2, 6),
        end: new Date(2024, 6, 2, 18),
    },
]
console.log(events);

const slotSample = slots;

function MyCalendar() {
    return (
        <>
            <Calendar
                localizer={localizer}
                backgroundEvents={backgroundEvents}
                events={events}
                popup
            // startAccessor="start"
            // endAccessor="end"
            />
        </>
    )
}

export default MyCalendar