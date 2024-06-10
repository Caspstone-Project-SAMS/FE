import './MyCalendar.less'
import 'react-big-calendar/lib/sass/styles.scss'
import moment from 'moment'
import { Button } from 'antd'
import toast from 'react-hot-toast'
import React, { useCallback, useEffect, useState } from 'react'

import events from './data/events'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'

import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import useDispatch from '../../redux/UseDispatch'
import { getScheduleByID } from '../../redux/slice/Calendar'

import CustomEvent from './items/events/CustomEvent'
import CustomEventDay from './items/events/CustomEventDay'
import CustomWeekEvent from './items/events/CustomEventWeek'
import CustomToolBar from './items/CustomToolBar'
import { Schedule } from '../../models/calendar/Schedule'
import { CustomEvent as RBC_Custom_Event } from '../../models/calendar/CustomEvent'
// import { slots } from './data/RawData'

moment.locale('ko', {
    week: {
        dow: 1,
        doy: 1,
    }
})
const localizer = momentLocalizer(moment)


// const slotSample = slots;
type RBC_Event = {
    id: number,
    title: string,
    start: Date,
    end: Date
}

type scheduleStatus = 'past' | 'current' | 'future';

function MyCalendar() {
    const [date, setDate] = useState(new Date());
    const [scheduleEvent, setScheduleEvent] = useState<RBC_Custom_Event[]>([]);
    const [selectedView, setSelectedView] = useState<View>(Views.WEEK)

    const schedule = useSelector((state: RootState) => state.calendar.schedule);
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

    const handleNavigate = useCallback((newDate: Date, view: View) => {
        setDate(newDate);
        setSelectedView(view);
    }, []);

    const handleSelectEvent = useCallback((event: RBC_Event) => {
        setDate(new Date(event.start))
        setSelectedView(Views.DAY);
    }, [setSelectedView]);

    const validateStatusSchedule = (startTime: Date, endTime: Date): scheduleStatus => {
        const currentTime = new Date();
        //future/current event
        if ((currentTime.valueOf() - endTime.valueOf()) <= 0) {
            if (currentTime.valueOf() - startTime.valueOf() >= 0) {
                return 'current'
            }
            return 'future'
        } else {
            return 'past'
        }
    };

    const fmtSchedule = (schedules: Schedule[]): RBC_Custom_Event[] => {
        try {
            // const defaultData = events;

            const fmtData = schedules.map((item, i) => {
                const dateArr = item.date.split('-');
                const startArr = item.startTime.split(':')
                const endArr = item.endTime.split(':')

                const fmtDate = {
                    year: Number(dateArr[0]),
                    day: Number(dateArr[1]),
                    month: Number(dateArr[2])
                }
                const fmtTime = {
                    startHour: Number(startArr[0]),
                    startMin: Number(startArr[1]),
                    endHour: Number(endArr[0]),
                    endMin: Number(endArr[1]),
                }
                const status = validateStatusSchedule(
                    new Date(fmtDate.year, fmtDate.month - 1, fmtDate.day, fmtTime.startHour, fmtTime.startMin),
                    new Date(fmtDate.year, fmtDate.month - 1, fmtDate.day, fmtTime.endHour, fmtTime.endMin)
                )
                return {
                    id: i,
                    title: `${item.classCode} - ${item.roomName}`,
                    start: new Date(fmtDate.year, fmtDate.month, fmtDate.day, fmtTime.startHour, fmtTime.startMin),
                    end: new Date(fmtDate.year, fmtDate.month, fmtDate.day, fmtTime.endHour, fmtTime.endMin),
                    slot: `Slot ${item.slotNumber}`,
                    room: item.roomName,
                    classCode: item.classCode,
                    scheduleID: item.scheduleID,
                    subjectCode: item.subjectCode,
                    status: status
                }
            })
            // defaultData.push(...fmtData)
            // console.log("This is fmtData ", defaultData);
            return fmtData
        } catch (error) {
            toast.error("An error occure when getting schedule!!!")
            console.log("Error at formating schedule");
            return [];
        }
    }

    useEffect(() => {
        const lecturerID = userDetail?.result?.id;
        if (lecturerID) {
            const arg = { lecturerID: lecturerID, semesterID: '2' };
            dispatch(getScheduleByID(arg))
        }
    }, [])

    useEffect(() => {
        const formatted = fmtSchedule(schedule);
        setScheduleEvent(formatted)

        // const mergedArr = [...events, ...formatted]
        // console.log("Format here ", mergedArr);
    }, [userDetail, schedule])


    return (
        <>
            {/* <Button onClick={() => { }}>Check</Button> */}
            <Calendar
                localizer={localizer}
                events={scheduleEvent}
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
                date={date}
                view={selectedView}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                onView={handleViewChange}
                onNavigate={handleNavigate}
                onSelectEvent={handleSelectEvent}
                style={{
                    backgroundColor: '#FFF',
                    padding: '10px',
                    borderRadius: '4px'
                }}
            />
        </>
    )
}

export default MyCalendar