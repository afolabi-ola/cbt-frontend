import { testsServices } from '@/services/testsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CreateTestRequest, CreateTestResponse } from '@/types/tests.types';
import { AppError } from '@/types/errors.types';

export default function useCreateTest() {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateTestResponse, AppError, CreateTestRequest>(
    {
      mutationFn: (payload: CreateTestRequest) =>
        testsServices.createTest(payload),
      onSuccess: (data) => {
        toast.success(data.message || 'Test created');
        queryClient.invalidateQueries({ queryKey: ['adminTests'] });
        queryClient.invalidateQueries({ queryKey: ['tests'] });
      },
      onError: (err: AppError) => {
        toast.error(err.details);
      },
    },
  );

  return mutation;
}
