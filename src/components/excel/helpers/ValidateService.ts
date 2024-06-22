import moment from 'moment';

const DateChecker = (dateFmt: string, input) => {
  if (input) {
    return moment(input, dateFmt, true).isValid();
  }
  return undefined;
};

export const ValidateService = {
  DateChecker,
};
