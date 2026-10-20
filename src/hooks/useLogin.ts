import { authService } from '@/services/authService';
import { initializeSocket } from '@/lib/socket';
import { AUTH_SESSION_STORAGE_KEY } from '@/lib/constants';
import { useUserStore } from '@/store/useUserStore';
import { LoginPayload, LoginResponse } from '@/types/auth.types';
import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useLogin() {
  const queryClient = useQueryClient();
  const setRole = useUserStore((state) => state.setRole);

  const { replace } = useRouter();
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useMutation<LoginResponse, AppError, LoginPayload>({
    mutationFn: authService.login,
    mutationKey: ['login'],
    onSuccess: (data) => {
      if (!data.success) return;

      queryClient.invalidateQueries();

      const role = data.data.data.role;
      localStorage.setItem(
        AUTH_SESSION_STORAGE_KEY,
        JSON.stringify({ role: role.toLowerCase() }),
      );
      initializeSocket();
      setRole(role.toLowerCase() as 'admin' | 'teacher' | 'student');

      if (role === 'STUDENT') {
        toast.success(data.message);
        replace('/dashboard');
        return;
      }

      toast.success(data.message);
      replace('/admin/dashboard');
    },

    onError: (err) => toast.error(getErrorDetails(err)),
  });

  return { login, isLoginPending, isLoginError };
}


//login_session_connected payload username