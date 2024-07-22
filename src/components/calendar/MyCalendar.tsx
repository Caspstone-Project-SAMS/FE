import './MyCalendar.less'
import 'react-big-calendar/lib/sass/styles.scss'

import moment from 'moment'
import toast from 'react-hot-toast'
import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'

import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'
import useDispatch from '../../redux/UseDispatch'
import { getScheduleByID, getScheduleByWeek } from '../../redux/slice/Calendar'

import CustomEvent from './items/events/CustomEvent'
import CustomEventDay from './items/events/CustomEventDay'
import CustomWeekEvent from './items/events/CustomEventWeek'
import CustomToolBar from './items/CustomToolBar'
import { Schedule } from '../../models/calendar/Schedule'
import { CustomEvent as RBC_Custom_Event } from '../../models/calendar/CustomEvent'
import { HelperService } from '../../hooks/helpers/helperFunc'
// import events from './data/events'

moment.updateLocale('ko', {
    week: {
        dow: 1,
        doy: 1,
    }
})
const localizer = momentLocalizer(moment)

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
    const [loading, setLoading] = useState<boolean>(false);

    const userDetail = useSelector((state: RootState) => state.auth.userDetail);
    const schedule = useSelector((state: RootState) => state.calendar.schedule);
    const timeLine = useSelector((state: RootState) => state.calendar.timeline);
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
        23
    )

    const handleViewChange = useCallback((view: View) => {
        setSelectedView(view);
    }, []);

    const handleNavigate = useCallback((newDate: Date, view: View) => {
        setDate(newDate);
        setSelectedView(view);
    }, []);

    const handleSelectEvent = useCallback((event: RBC_Event) => {
        // console.log("selectedView: ", selectedView);
        // if (selectedView === Views.DAY) {
        //     navigate('/class/classdetails')
        // } else {
        setDate(new Date(event.start))
        setSelectedView(Views.DAY);
        // }
    }, [selectedView]);

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
            const fmtData = schedules.map((item, i) => {
                const dateArr = item.date.split('-');
                const startArr = item.startTime.split(':')
                const endArr = item.endTime.split(':')

                const fmtDate = {
                    year: Number(dateArr[0]),
                    month: Number(dateArr[1]),
                    day: Number(dateArr[2]),
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
                    title: `${item.subjectCode} - ${item.roomName}`,
                    start: new Date(fmtDate.year, fmtDate.month - 1, fmtDate.day, fmtTime.startHour, fmtTime.startMin),
                    end: new Date(fmtDate.year, fmtDate.month - 1, fmtDate.day, fmtTime.endHour, fmtTime.endMin),
                    slot: `Slot ${item.slotNumber}`,
                    room: item.roomName,
                    classCode: item.classCode,
                    scheduleID: item.scheduleID,
                    subjectCode: item.subjectCode,
                    status: status
                }
            })

            // console.log("This is fmtData ", fmtData);
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
            const week: Date[] = HelperService.getWeekFromDate(today)
            const arg = { lecturerID: lecturerID, semesterID: '2', week };
            dispatch(getScheduleByWeek(arg))
        }
    }, [])

    useEffect(() => {
        if (userDetail && schedule && schedule.length > 0) {
            const formatted = fmtSchedule(schedule);
            // console.log("Schedule API: ", schedule);
            setScheduleEvent(formatted)
        } else {
            console.log("userDetail, schedule are undefined");
            setScheduleEvent([])
        }
    }, [userDetail, schedule])


    return (
        <Calendar
            localizer={localizer}
            events={scheduleEvent}
            min={startHour}
            max={endHour}
            popup
            onRangeChange={(range) => {
                // console.log("range change,", range);
                const lecturerID = userDetail?.result?.id;

                //Havent do check contained date successful
                if (selectedView === 'week' && Array.isArray(range) && lecturerID) {
                    const randomDelay = HelperService.randomDelay();
                    setLoading(true);
                    setTimeout(() => {
                        const isContainedTimeLine = HelperService.checkContainedDate(range, timeLine)
                        if (!isContainedTimeLine) {
                            const arg = { lecturerID: lecturerID, semesterID: '2', week: range };
                            dispatch(getScheduleByWeek(arg))
                        }
                        setLoading(false)
                    }, randomDelay)
                }
            }}
            components={{
                event: CustomEvent,
                week: {
                    event: CustomWeekEvent,
                },
                day: {
                    event: CustomEventDay
                },
                toolbar: (toolbar) => <CustomToolBar toolbar={toolbar} loadingStatus={loading} />
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
    )
}

export default MyCalendar