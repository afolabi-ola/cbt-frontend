import api from '@/lib/axios';
import { TestsResponse } from '@/types/tests.types';

export const testsServices = {
  getTests: async (): Promise<TestsResponse> => {
    const response = await api.get('/tests', {
      withCredentials: true,
    });
    return response.data;
  },
};