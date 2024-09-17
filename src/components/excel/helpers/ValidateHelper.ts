import moment from 'moment';

const dateChecker = (dateFmt: string, input) => {
  if (input) {
    return moment(input, dateFmt, true).isValid();
  }
  return undefined;
};

const emojiChecker = (text: string): boolean => {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  const emojiArr = text.match(emojiRegex);
  if (emojiArr && emojiArr.length >= 1) return true;
  return false;
};

const emailChecker = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

const formatScheduleExcel = (text: string) => {
  // const regex = /(?<classCode>.+?)\s*at\s+(?<room>P\.?\s*\d+)/;
  // /(?<classCode>.+?)\s*at\s+(?<room>(?:P\.?)?\s*\d+)/
  const regex = /(?<classCode>.+?)\s*at\s+(?<room>(?:P\.?)?\s*\w+)/;
  const match = text.match(regex);
  if (match && match.groups) {
    const classCode = match.groups.classCode.replace(' ', ''); // SE1611- PRJ => SE1611-PRJ
    const room = match.groups.room.replace(' ', '');
    return { classCode, room };
  }
  return {};
};

export const ValidateHelper = {
  dateChecker,
  emojiChecker,
  emailChecker,
  formatScheduleExcel,
};
