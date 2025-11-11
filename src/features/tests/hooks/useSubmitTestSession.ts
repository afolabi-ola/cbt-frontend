import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitTestSession } from '@/services/testsService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTestResult } from '../context/TestResultContext';
import { SubmitTestSessionResponse } from '@/types/tests.types';
import { AppError } from '@/types/errors.types';

/**
 * React Query hook to submit/end a test session
 */
export function useSubmitTestSession(sessionId: string | number) {
  const router = useRouter();
  const { setTestResult } = useTestResult();
  const queryClient = useQueryClient();

  return useMutation<SubmitTestSessionResponse, AppError>({
    mutationFn: () => submitTestSession(sessionId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store the test result in context
        setTestResult(response.data);
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['tests'] });
        // Redirect to test ended page
        router.push(`/tests/ended`);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
