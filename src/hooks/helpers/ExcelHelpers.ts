const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

const determineFileType = (file) => {
  const extension = getFileExtension(file.name);
  if (extension === 'xls') {
    return 'XLS';
  } else if (extension === 'xlsx') {
    return 'XLSX';
  } else {
    return 'UNKNOWN';
  }
};

const checkValidStudentCode = (studentCode: string): boolean => {
  const regex = /^[A-Za-z]+\d{6}$/;

  if (regex.test(studentCode)) {
    return true;
  }
  return false;
};

export const ExcelHelpers = {
  determineFileType,
  checkValidStudentCode,
};
