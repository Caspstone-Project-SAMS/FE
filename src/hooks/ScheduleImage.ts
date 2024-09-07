import axios from 'axios';
import { ScheduleImage } from '../models/calendar/ScheduleImage';
import { IMPORT_SCHEDULE_IMAGE_API } from '.';

interface ImportScheduleParams {
  Image: File;
  UserId: string;
  RecommendationRate: number;
}

const previewScheduleImage = async ({
  Image,
  UserId,
  RecommendationRate,
}: ImportScheduleParams): Promise<ScheduleImage> => {
  try {
    const formData = new FormData();
    formData.append('Image', Image, Image.name);
    formData.append('UserId', UserId);
    formData.append('RecommendationRate', RecommendationRate.toString());

    const response = await axios.post(
      `${IMPORT_SCHEDULE_IMAGE_API}`,
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
      if (error.response.status === 500) {
        throw new Error('Unvalid image, can not process preview version!');
      } else {
        throw new Error('Unexpected error occurred');
      }
    }
  }
};

export const ScheduleImageService = {
  previewScheduleImage,
};
