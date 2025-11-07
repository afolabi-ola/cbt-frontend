import api from '@/lib/axios';
import { DashboardResponse } from '@/types/dashboard.types';

export const dashboardServices = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get('/dashboard', {
      withCredentials: true,
    });
    return response.data;
  },
};
