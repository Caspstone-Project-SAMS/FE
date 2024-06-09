import './MyCalendar.less'
import 'react-big-calendar/lib/sass/styles.scss'
import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'

import events from './data/events'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'

import CustomEvent from './items/events/CustomEvent'
import CustomWeekEvent from './items/events/CustomEventWeek'
import CustomToolBar from './items/CustomToolBar'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import { CalendarService } from '../../hooks/Calendar'
import { getScheduleByID } from '../../redux/slice/Calendar'
import useDispatch from '../../redux/UseDispatch'
import CustomEventDay from './items/events/CustomEventDay'
// import { slots } from './data/RawData'

moment.locale('ko', {
    week: {
        dow: 1,
        doy: 1,
    }
})
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
    const [scheduleEvent, setScheduleEvent] = useState();
    const [selectedView, setSelectedView] = useState<View>(Views.WEEK)

    const userDetail = useSelector((state: RootState) => state.auth.userDetail);
    const dispatch = useDispatch();

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

    const handleViewChange = useCallback((view: View) => {
        setSelectedView(view);
    }, []);

    const handleSelectEvent = useCallback((event) => {
        setSelectedView(Views.DAY);
    }, [setSelectedView]);

    useEffect(() => {
        const lecturerID = userDetail?.result?.id;
        if (lecturerID) {
            const arg = { lecturerID: lecturerID, semesterID: '2' };
            dispatch(getScheduleByID(arg))
        }

    }, [])

    return (
        <Calendar
            localizer={localizer}
            backgroundEvents={backgroundEvents}
            events={events}
            min={startHour}
            max={endHour}
            popup
            components={{
                event: CustomEvent,
                week: {
                    event: CustomWeekEvent,
                },
                day: {
                    event: CustomEventDay
                },
                toolbar: CustomToolBar
            }}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            view={selectedView}
            onView={handleViewChange}
            onSelectEvent={handleSelectEvent}
            style={{
                backgroundColor: '#FFF',
                padding: '10px',
                borderRadius: '4px'
            }}
        />
    )
}

export default MyCalendar