const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

//Year, month, day, hour, minute
export default [
  {
    id: 0,
    title: 'MLN131 - nvh.Room414',
    start: new Date(currentYear, currentMonth, currentDay, 7, 0),
    end: new Date(currentYear, currentMonth, currentDay, 9, 15),
  },
  {
    id: 1,
    title: 'HCM202 - nvh.Room414',
    start: new Date(currentYear, currentMonth, currentDay, 9, 30),
    end: new Date(currentYear, currentMonth, currentDay, 11, 45),
  },
  {
    id: 2,
    title: 'SEP490 - nvh.Room414',
    start: new Date(currentYear, currentMonth, currentDay, 12, 30),
    end: new Date(currentYear, currentMonth, currentDay, 14, 45),
  },
  {
    id: 3,
    title: 'SWP391 - Room202',
    start: new Date(currentYear, currentMonth, currentDay + 1, 12, 30),
    end: new Date(currentYear, currentMonth, currentDay + 1, 14, 45),
  },
  {
    id: 4,
    title: 'PRJ301 - Room202',
    start: new Date(currentYear, currentMonth, currentDay + 1, 15, 0),
    end: new Date(currentYear, currentMonth, currentDay + 1, 17, 15),
  },
  {
    id: 5,
    title: 'IOT102 - Room202',
    start: new Date(currentYear, currentMonth, currentDay + 1, 17, 30),
    end: new Date(currentYear, currentMonth, currentDay + 1, 19, 15),
  },

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
];
