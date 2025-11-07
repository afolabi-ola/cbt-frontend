import { LiaBookSolid } from 'react-icons/lia';
import { Test } from '@/types/tests.types';

interface RegisteredCoursesSectionProps {
  tests?: Test[];
}

export default function RegisteredCoursesSection({ tests = [] }: RegisteredCoursesSectionProps) {
  // Extract unique courses from tests
  const uniqueCourses = tests.reduce((acc, test) => {
    const courseTitle = test.course.title;
    if (!acc.find(course => course.title === courseTitle)) {
      acc.push({
        id: test.courseId,
        title: courseTitle,
      });
    }
    return acc;
  }, [] as { id: number; title: string }[]);

  const hasCourses = uniqueCourses.length > 0;

  return (
    <section className='p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4'>
      <h2 className='text-lg font-semibold text-gray-700 border-b pb-2'>
        Registered Courses
      </h2>

      {hasCourses ? (
        <div className='space-y-3'>
          {uniqueCourses.map((course) => (
            <div
              key={course.id}
              className='flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm'
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 text-blue-600 rounded-full'>
                  <LiaBookSolid size={20} />
                </div>
                <div>
                  <h4 className='font-medium text-gray-800'>{course.title}</h4>
                  <p className='text-sm text-gray-600'>
                    {tests.filter(t => t.course.title === course.title).length} test(s)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-8 px-4'>
          <svg
            className='w-12 h-12 text-gray-300 mb-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
            />
          </svg>
          <p className='text-gray-600 font-medium'>No courses registered</p>
          <p className='text-sm text-gray-500 text-center mt-1'>
            Courses will appear here when you have tests
          </p>
        </div>
      )}
    </section>
  );
}
