import moment from 'moment';
import * as CryptoTS from 'crypto-ts';

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

const navigateFAP = () => {
  window.open('https://fap.fpt.edu.vn/', '_blank');
};

const randomDelay = () => Math.floor(Math.random() * 1200) + 1000;

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
  capitalizeFirstLetter,
  downloadFile,
  getWeekFromDate,
  navigateFAP,
  randomDelay,
  checkContainedDate,
  removeDuplicates,
  encryptString,
  decryptString,
};
