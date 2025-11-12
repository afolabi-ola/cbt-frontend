import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AcademicInformation } from '@/types/profile.types';
import RegisteredCoursesSection from '@/features/tests/components/RegisteredCoursesSection';

interface AcademicInfoSectionProps {
  data: AcademicInformation;
}

/**
 * AcademicInfoSection Component
 * Displays read-only academic information
 */
export default function AcademicInfoSection({
  data,
}: AcademicInfoSectionProps) {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-neutral-900 mb-6'>
        Academic Information
      </h3>

      <div className='space-y-4'>
        {/* Class */}
        <div>
          <label className='block text-sm font-medium text-neutral-700 mb-2'>
            Class
          </label>
          <div className='px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900'>
            {data.className}
          </div>
        </div>

        {/* Registered Courses */}
        <div>
          <RegisteredCoursesSection />
        </div>
      </div>
    </Card>
  );
}
