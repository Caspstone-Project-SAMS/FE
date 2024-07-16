import axios from 'axios';
import { ExcelClassList } from '../models/Class';
import { CLASS_API } from '.';
import { HelperService } from './helpers/helperFunc';
import toast from 'react-hot-toast';

const importExcelClass = async (data: ExcelClassList[]) => {
  const res = await axios.post(CLASS_API, data);
  return res.data;
};

const downloadTemplateExcel = async () => {
  try {
    const response = await axios(`${CLASS_API}/download-excel-template`, {
      responseType: 'blob',
    });
    const blobFile = response.data;
    HelperService.downloadFile(blobFile, 'template_class');
  } catch (error) {
    console.log('Error when download template_class');
    toast.error('Unknown error occured, please try again later');
  }
};

export const ClassService = {
  downloadTemplateExcel,
};
