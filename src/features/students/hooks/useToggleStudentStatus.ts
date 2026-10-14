import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import type { UpdateUserStatusResponse } from '@/types/auth.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { authService } from '@/services/authService';

export default function useToggleStudentStatus() {
  return useMutation<
    UpdateUserStatusResponse,
    AppError,
    { userId: string | number; isActive: boolean }
  >({
    mutationFn: ({ userId, isActive }) =>
      authService.updateUserStatus(userId, isActive),
    onSuccess: (data) => {
      toast.success(data?.message || 'Student status updated');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: unknown) => {
      toast.error(getErrorDetails(err) || 'Failed to update student status');
    },
  });
}
