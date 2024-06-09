const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

//Year, month, day, hour, minute
export default [
  {
    id: 0,
    title: 'MLN131 - nvh_Ro.414',
    start: new Date(currentYear, currentMonth, currentDay, 7, 0),
    end: new Date(currentYear, currentMonth, currentDay, 9, 15),
    slot: 'slot 1',
    class: 'NJS1601',
    status: 'past',
  },
  {
    id: 1,
    title: 'HCM202 - nvh_Ro.414',
    start: new Date(currentYear, currentMonth, currentDay, 9, 30),
    end: new Date(currentYear, currentMonth, currentDay, 11, 45),
    slot: 'slot 2',
    class: 'NJS1601',
    status: 'current',
  },
  {
    id: 2,
    title: 'SEP490 - nvh_Ro.414',
    start: new Date(currentYear, currentMonth, currentDay, 12, 30),
    end: new Date(currentYear, currentMonth, currentDay, 14, 45),
    slot: 'slot 3',
    class: 'NJS1601',
    status: 'future',
  },
  {
    id: 3,
    title: 'SWP391 - Ro.202',
    start: new Date(currentYear, currentMonth, currentDay + 1, 12, 30),
    end: new Date(currentYear, currentMonth, currentDay + 1, 14, 45),
    slot: 'slot 3',
    class: 'NJS1601',
    status: 'past',
  },
  {
    id: 4,
    title: 'PRJ301 - Ro.202',
    start: new Date(currentYear, currentMonth, currentDay + 1, 15, 0),
    end: new Date(currentYear, currentMonth, currentDay + 1, 17, 15),
    slot: 'slot 4',
    class: 'NJS1601',
    status: 'past',
  },
  {
    id: 5,
    title: 'IOT102 - Ro.202',
    start: new Date(currentYear, currentMonth, currentDay + 1, 17, 30),
    end: new Date(currentYear, currentMonth, currentDay + 1, 19, 45),
    slot: 'slot 5',
    class: 'NJS1601',
    status: 'current',
  },
];

/* {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1),
  }, 
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2015, 3, 7),
    end: new Date(2015, 3, 10),
  },

  {
    id: 2,
    title: 'DTS STARTS',
    start: new Date(2016, 2, 13, 0, 0, 0),
    end: new Date(2016, 2, 20, 0, 0, 0),
  },
  */
