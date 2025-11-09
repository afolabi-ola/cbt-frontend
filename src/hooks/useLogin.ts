import { authService } from '@/services/authService';
import { LoginPayload, LoginResponse } from '@/types/auth.types';
import { AppError } from '@/types/errors.types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useLogin() {
  const { push } = useRouter();
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useMutation<LoginResponse, AppError, LoginPayload>({
    mutationFn: authService.login,
    mutationKey: ['login'],
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        push('/dashboard');
      }
    },

    onError: (err) => {
      toast.error((err.details as string).toUpperCase());
    },
  });

  return { login, isLoginPending, isLoginError };
}
