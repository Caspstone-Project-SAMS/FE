import moment from 'moment';
import * as CryptoTS from 'crypto-ts';

moment.updateLocale('ko', {
  week: {
    dow: 1,
    doy: 1,
  },
});

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const downloadFile = (blobFile, fileName: string) => {
  const href = URL.createObjectURL(blobFile);

  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

type WeekDay = Date;

const getWeekFromDate = (inputDate: Date): WeekDay[] => {
  const startOfWeek = moment(inputDate).startOf('week');
  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = moment(startOfWeek).add(i, 'days').toDate();
    week.push(date);
  }

  return week;
};

const generateWeekFromCur = () => {
  const weeks = [];
  const startOfYear = moment().startOf('week').add(1, 'week');
  const endOfYear = moment().endOf('year');

  const current = startOfYear.clone();
  while (current.isBefore(endOfYear)) {
    const weekStart = current.clone().startOf('week').format('DD/MM');
    const weekEnd = current.clone().endOf('week').format('DD/MM');
    weeks.push({
      label: `${weekStart} - ${weekEnd}`,
      value: `${weekStart} - ${weekEnd}`,
    });
    current.add(1, 'week');
  }

  return weeks;
};

const getDaysOfWeek = (range: string) => {
  const [start, end] = range.split(' - ');
  const startDate = moment(start, 'DD/MM');
  const endDate = moment(end, 'DD/MM');
  const days = [];

  const currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    days.push(currentDate.format('YYYY-MM-DD'));
    currentDate.add(1, 'day');
  }

  return days;
};

const getWeeks = (
  startDate: string,
  endDate: string,
  inputType: string, //DD-MM or YYYY/MM/DD and similar...
  returnType: string,
  exact: boolean, // For output exactly from startDay and endDay
) => {
  try {
    const start = moment(startDate, inputType);
    const end = moment(endDate, inputType);
    const weeks = [];

    let current = start.clone().startOf('isoWeek');

    if (exact) {
      // Handle the first week
      const firstWeekStart = start.clone().format(returnType);
      const firstWeekEnd = current.clone().endOf('isoWeek').format(returnType);
      weeks.push(`${firstWeekStart} - ${firstWeekEnd}`);

      current.add(1, 'weeks');
      while (current.isBefore(end, 'week')) {
        const weekStart = current.clone().startOf('isoWeek').format(returnType);
        const weekEnd = current.clone().endOf('isoWeek').format(returnType);
        weeks.push(`${weekStart} - ${weekEnd}`);
        current.add(1, 'weeks');
      }

      // Handle the last week
      const lastWeekStart = current
        .clone()
        .startOf('isoWeek')
        .format(returnType);
      const lastWeekEnd = end.clone().format(returnType);
      if (current.isSame(end, 'week')) {
        weeks.push(`${lastWeekStart} - ${lastWeekEnd}`);
      }
    } else {
      while (current.isBefore(end) || current.isSame(end, 'week')) {
        const weekStart = current.clone().format(returnType);
        const weekEnd = current.clone().endOf('isoWeek').format(returnType);
        weeks.push(`${weekStart} - ${weekEnd}`);
        current.add(1, 'weeks');
      }
    }

    return weeks;
  } catch (error) {
    return [];
  }
};

const isStartWeekSooner = (weekStart: string, weekEnd: string): boolean => {
  const startDate1 = weekStart.split(' - ')[0];
  const startDate2 = weekEnd.split(' - ')[0];

  const week1 = moment(startDate1, 'DD/MM');
  const date2 = moment(startDate2, 'DD/MM');

  if (week1.isBefore(date2)) {
    return true;
  } else if (week1.isAfter(date2)) {
    return false;
  } else {
    // 2 week equal
    return true;
  }
};

const navigateFAP = () => {
  window.open('https://fap.fpt.edu.vn/', '_blank');
};

const randomDelay = () => Math.floor(Math.random() * 400) + 200;

const checkContainedDate = (item: Date[], sample: Date[]): boolean => {
  // console.log('Item in ', item);
  // console.log('sample already has ', sample);
  return item.every((value) => sample.includes(value));
};

const removeDuplicates = (arr: string[]): string[] => {
  const uniqueSet = new Set(arr);
  return Array.from(uniqueSet);
};

//Encrypt & Decrypt
const encryptString = (text: string) => {
  const ciphertext = CryptoTS.AES.encrypt(text, 'SAMS_sc_key');
  return ciphertext.toString();
};
const decryptString = (cipherText: string): object => {
  const bytes = CryptoTS.AES.decrypt(cipherText.toString(), 'SAMS_sc_key');
  const plaintext = JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
  return plaintext;
};

export const HelperService = {
  downloadFile,
  navigateFAP,
  randomDelay,
  //Day
  getWeekFromDate,
  checkContainedDate,
  generateWeekFromCur,
  getWeeks,
  getDaysOfWeek,
  isStartWeekSooner,
  //String
  capitalizeFirstLetter,
  removeDuplicates,
  encryptString,
  decryptString,
};
