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

export const ExcelHelpers = {
  determineFileType,
};
