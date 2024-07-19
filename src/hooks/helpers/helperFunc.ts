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

<<<<<<< HEAD
export const HelperService = {
  capitalizeFirstLetter,
  downloadFile,
=======
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

const randomDelay = () => Math.floor(Math.random() * 1600) + 1000;

const checkContainedDate = (item: Date[], sample: Date[]): boolean => {
  // console.log('Item in ', item);
  // console.log('sample already has ', sample);
  return item.every((value) => sample.includes(value));
};

export const HelperService = {
  capitalizeFirstLetter,
  downloadFile,
  getWeekFromDate,
  navigateFAP,
  randomDelay,
  checkContainedDate,
>>>>>>> 97b3f8c3040ef4483297ebce9d74efabf251deb3
};
