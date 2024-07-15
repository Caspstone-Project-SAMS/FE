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

export const HelperService = {
  capitalizeFirstLetter,
  downloadFile,
};
