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

const getWeeks = (startDate: string, endDate: string) => {
  const start = moment(startDate, 'DD/MM');
  const end = moment(endDate, 'DD/MM');
  const weeks = [];

  const current = start.clone().startOf('isoWeek');

  while (current.isBefore(end) || current.isSame(end, 'week')) {
    const weekStart = current.clone().format('DD/MM');
    const weekEnd = current.clone().endOf('isoWeek').format('DD/MM');
    weeks.push(`${weekStart} - ${weekEnd}`);
    current.add(1, 'weeks');
  }

  return weeks;
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

const randomDelay = () => Math.floor(Math.random() * 800) + 500;

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
