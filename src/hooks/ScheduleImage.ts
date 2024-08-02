import axios from 'axios';
import { ScheduleImage } from '../models/calendar/ScheduleImage';

interface ImportScheduleParams {
  Image: File; 
  SemesterId: number;
  UserId: string;
  RecommendationRate: number;
}

const importScheduleImage = async ({
  Image,
  SemesterId,
  UserId,
  RecommendationRate,
}: ImportScheduleParams): Promise<ScheduleImage | null> => {
  try {
    const formData = new FormData();
    formData.append('Image', Image, Image.name);
    formData.append('SemesterId', SemesterId.toString());
    formData.append('UserId', UserId);
    formData.append('RecommendationRate', RecommendationRate.toString());

    const response = await axios.post(
      'http://34.81.224.196/api/Import/schedules',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer YOUR_ACCESS_TOKEN', 
        },
      },
    );

    return response.data as ScheduleImage;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error importing schedule image:', error.message);
      throw new Error(
        error.response.data.message || 'Error importing schedule image',
      );
    }
    throw new Error('Unexpected error occurred');
  }
};

export const ScheduleImageService = {
  importScheduleImage,
};
