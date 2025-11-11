import { testsServices } from '@/services/testsService';
import { useQuery } from '@tanstack/react-query';

export default function useRegisteredCourses() {
  const {
    data: registeredCourses,
    isLoading: isRegisteredCoursesLoading,
    error: registeredCoursesError,
  } = useQuery({
    queryFn: testsServices.getRegisteredCourses,
    queryKey: ['registered-courses'],
  });

  return {
    registeredCourses,
    isRegisteredCoursesLoading,
    registeredCoursesError,
  };
}
