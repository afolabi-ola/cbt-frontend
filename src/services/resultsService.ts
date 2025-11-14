import api from '@/lib/axios';
import {
  StudentResultCoursesResponse,
  StudentResultDownloadResponse,
} from '@/types/results.types';

export const resultsServices = {
  getStudentResultCourses: async (): Promise<StudentResultCoursesResponse> => {
    const response = await api.get('/results/student/courses', {
      withCredentials: true,
    });

    return (response.data?.data ??
      response.data) as StudentResultCoursesResponse;
  },

  downloadStudentResultCourses:
    async (): Promise<StudentResultDownloadResponse> => {
      const response = await api.get('/results/student/courses/download', {
        withCredentials: true,
      });

      return response.data;
    },
};
