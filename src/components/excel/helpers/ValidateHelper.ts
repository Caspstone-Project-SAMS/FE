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

export const ValidateHelper = {
  dateChecker,
  emojiChecker,
  emailChecker,
};
