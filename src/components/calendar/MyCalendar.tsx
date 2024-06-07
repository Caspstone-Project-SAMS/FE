import React from 'react'
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import './MyCalendar.less'
import 'react-big-calendar/lib/sass/styles.scss'
import events from './data/events'
import CustomEvent from './items/events/CustomEvent'
import CustomWeekEvent from './items/events/CustomEventWeek'
import CustomToolBar from './items/CustomToolBar'
// import { slots } from './data/RawData'

const localizer = momentLocalizer(moment)

const backgroundEvents = [
    {
        id: 0,
        title: 'Available for Clients',
        start: new Date(2024, 6, 2, 6),
        end: new Date(2024, 6, 2, 18),
    },
]

// const slotSample = slots;

function MyCalendar() {
    const today = new Date();
    const startHour = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        6
    )
    const endHour = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        22
    )

    return (
        <Calendar
            localizer={localizer}
            backgroundEvents={backgroundEvents}
            events={events}
            popup
            components={{
                event: CustomEvent,
                week: {
                    event: CustomWeekEvent
                },
                toolbar: CustomToolBar
            }}
            // toolbar={<CustomToolBar />}
            min={startHour}
            max={endHour}
            style={{ backgroundColor: '#FFF', padding: '10px', borderRadius: '4px' }}
        />
    )
}

export default MyCalendar