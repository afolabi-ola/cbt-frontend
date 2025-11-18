'use client';

import { authService } from '@/services/authService';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useLogout() {
  const { replace } = useRouter();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: authService.logout,

    onSuccess: (data) => {
      toast.success(data.message);
      replace('/');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { logout, isLoggingOut };
}
