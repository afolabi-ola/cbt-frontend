'use client';
import AppTable, { TableDataItem } from '@/components/table';
import { Badge, Button } from '@/components/ui';
import Input from '@/components/ui/input';
// import { Test, testData } from './data';
import { useAdminTest } from '@/features/tests/hooks/useTests';
import { errorLogger } from '@/lib/axios';
import { Test as TestType, AdminTestsResponse } from '@/types/tests.types';
type AdminTestItem = AdminTestsResponse['data'][number];
import { formatDate } from '../../../../../utils/helpers';
import FilterBar, { FilterState } from '@/components/tests/FilterBar';
import TestSummary from '@/components/tests/TestSummary';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import useCreateTest from '@/features/tests/hooks/useCreateTest';
import Modal from '@/components/modal';
import {
  useGetCourses,
  useGetQuestionBank,
} from '@/features/dashboard/queries/useDashboard';

function AddTestForm() {
  const {
    data: coursesData,
    isLoading: isCoursesDataLoading,
    error: coursesError,
  } = useGetCourses();

  const {
    data: allQuestionBank,
    isLoading: questionBankLoading,
    error: questionBankError,
  } = useGetQuestionBank();

  if (coursesError) errorLogger(coursesError);
  if (questionBankError) errorLogger(questionBankError);

  const createTestMutation = useCreateTest();

  type FormValues = {
    title: string;
    type: string;
    testState: string;
    courseId: string;
    bankId: string;
    duration: number;
    attemptsAllowed: number;
    passMark: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: yupResolver(
      // yup schema that accepts string inputs for numeric fields and transforms them
      Yup.object({
        title: Yup.string().required('Test title is required'),
        type: Yup.string().required('Test type is required'),
        testState: Yup.string().required('Test state is required'),
        courseId: Yup.string().required('Course is required'),
        bankId: Yup.string().required('Question bank is required'),
        duration: Yup.number()
          .transform((value, originalValue) =>
            originalValue === '' ? NaN : Number(originalValue),
          )
          .typeError('Duration must be a number')
          .required('Duration is required')
          .min(1),
        attemptsAllowed: Yup.number()
          .transform((value, originalValue) =>
            originalValue === '' ? NaN : Number(originalValue),
          )
          .typeError('Attempts allowed must be a number')
          .required('Attempts allowed is required')
          .min(1),
        passMark: Yup.number()
          .transform((value, originalValue) =>
            originalValue === '' ? NaN : Number(originalValue),
          )
          .typeError('Pass mark must be a number')
          .required('Pass mark is required')
          .min(0)
          .max(100),
        startDate: Yup.string().required('Start date is required'),
        startTime: Yup.string().required('Start time is required'),
        endDate: Yup.string().required('End date is required'),
        endTime: Yup.string().required('End time is required'),
      }),
    ),
    defaultValues: {
      title: '',
      type: 'TEST',
      testState: 'scheduled',
      courseId: '',
      bankId: '',
      duration: 60,
      attemptsAllowed: 1,
      passMark: 50,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
  });

  const selectedCourseId = watch('courseId');

  useEffect(() => {
    if (!selectedCourseId) {
      setValue('bankId', '');
      return;
    }

    const banksForCourse = (allQuestionBank?.data ?? []).filter(
      (b) => `${b.courseId}` === `${selectedCourseId}`,
    );
    if (banksForCourse.length) setValue('bankId', `${banksForCourse[0].id}`);
  }, [selectedCourseId, allQuestionBank, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!data.courseId) return toast.error('Please select a course');
    if (!data.bankId) return toast.error('Please select a question bank');

    const startTime =
      data.startDate && data.startTime
        ? new Date(`${data.startDate}T${data.startTime}`).toISOString()
        : null;
    const endTime =
      data.endDate && data.endTime
        ? new Date(`${data.endDate}T${data.endTime}`).toISOString()
        : null;

    const payload = {
      title: data.title,
      type: data.type?.toUpperCase(),
      testState: data.testState,
      startTime,
      endTime,
      duration: Number(data.duration),
      courseId: Number(data.courseId),
      bankId: Number(data.bankId),
      attemptsAllowed: Number(data.attemptsAllowed),
      passMark: Number(data.passMark),
    };

    try {
      await createTestMutation.mutateAsync(payload);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Test Title'
        name='title'
        placeholder='MAT 101'
        type='text'
        hookFormRegister={register}
        errorText={errors.title?.message as string}
      />

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='testType'>
            <span className='text-sm text-neutral-600'> Test Type</span>

            <select
              id='testType'
              {...register('type', { required: 'Test type is required' })}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value='TEST'>TEST</option>
              <option value='EXAM'>EXAM</option>
            </select>
            {errors.type && (
              <small className='text-error-500'>{errors.type.message}</small>
            )}
          </label>
        </div>

        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='testState'>
            <span className='text-sm text-neutral-600'>Test State</span>

            <select
              id='testState'
              {...register('testState', { required: 'Test state is required' })}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value='active'>ACTIVE</option>
              <option value='scheduled'>SCHEDULED</option>
              <option value='completed'>COMPLETED</option>
            </select>
            {errors.testState && (
              <small className='text-error-500'>
                {errors.testState.message}
              </small>
            )}
          </label>
        </div>
      </div>

      <div>
        <span className='text-sm text-neutral-600'>Select Courses</span>
        <div className='w-full flex gap-4 flex-wrap'>
          {coursesData?.map((course) => (
            <label
              htmlFor={`course-${course.id}`}
              key={course.id}
              className='flex gap-2'
            >
              {course.title}
              <input
                key={course.id}
                {...register('courseId', { required: 'Course is required' })}
                type='radio'
                id={`course-${course.id}`}
                value={`${course.id}`}
              />
            </label>
          ))}
          {errors.courseId && (
            <div className='text-sm text-error-500'>
              {errors.courseId.message}
            </div>
          )}
        </div>
      </div>

      <div>
        <span className='text-sm text-neutral-600'>Question Bank</span>
        {!selectedCourseId ? (
          <div className='text-sm text-neutral-500'>
            Select a course to choose a bank
          </div>
        ) : (
          <div className='w-full flex gap-4 flex-wrap'>
            {(allQuestionBank?.data ?? [])
              .filter((b) => `${b.courseId}` === `${selectedCourseId}`)
              .map((bank) => (
                <label key={bank.id} className='flex gap-2 items-start'>
                  <input
                    {...register('bankId', {
                      required: 'Question bank is required',
                    })}
                    type='radio'
                    value={`${bank.id}`}
                    className='mt-1'
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{bank.questionBankName}</span>
                    <small className='text-neutral-500'>
                      {bank._count?.questions ?? 0} questions
                    </small>
                  </div>
                </label>
              ))}
            {errors.bankId && (
              <div className='text-sm text-error-500'>
                {errors.bankId.message}
              </div>
            )}
            {(allQuestionBank?.data ?? []).filter(
              (b) => `${b.courseId}` === `${selectedCourseId}`,
            ).length === 0 && (
              <div className='text-sm text-error-500'>
                No question banks available for this course
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex gap-4'>
        <Input
          label='Duration(mins)'
          name='duration'
          placeholder='20'
          type='number'
          hookFormRegister={register}
          errorText={errors.duration?.message as string}
        />
        <Input
          label='Attempts Allowed'
          name='attemptsAllowed'
          placeholder='2'
          type='number'
          hookFormRegister={register}
          errorText={errors.attemptsAllowed?.message as string}
        />
        <Input
          label='Pass Mark'
          name='passMark'
          placeholder='50'
          type='number'
          hookFormRegister={register}
          errorText={errors.passMark?.message as string}
        />
      </div>

      <div className='flex gap-4'>
        <Input
          label='Start Date'
          name='startDate'
          type='date'
          hookFormRegister={register}
          errorText={errors.startDate?.message as string}
        />
        <Input
          label='End Date'
          name='endDate'
          hookFormRegister={register}
          type='date'
          errorText={errors.startDate?.message as string}
        />
        <Input
          label='Start Time'
          type='time'
          name='startTime'
          hookFormRegister={register}
          errorText={errors.startTime?.message as string}
        />
        <Input
          label='End Time'
          name='endTime'
          type='time'
          hookFormRegister={register}
          errorText={errors.endTime?.message as string}
        />
      </div>

      <div className='w-full flex justify-end'>
        <div className='w-fit'>
          <Button
            type='submit'
            disabled={
              isSubmitting || isCoursesDataLoading || questionBankLoading
            }
          >
            {isSubmitting ? 'Creating...' : 'Create test'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function AdminTestPage() {
  const {
    data: adminTestsData,
    isLoading: isAdminTestLoading,
    error: adminTestError,
  } = useAdminTest();

  const [isAddTestOpen, setIsAddTestOpen] = useState(false);

  const [filter, setFilter] = useState<FilterState>({
    query: '',
  });

  const courses = useMemo(() => {
    const arr = (adminTestsData?.data ?? [])
      .map((d: AdminTestItem) => d.course?.title)
      .filter(Boolean) as string[];
    return Array.from(new Set(arr));
  }, [adminTestsData]);

  const classes = useMemo(() => {
    const arr = (adminTestsData?.data ?? []).flatMap(
      (d: AdminTestItem) =>
        d.course?.classes?.map((c) => c.className) ?? ([] as string[]),
    );
    return Array.from(new Set(arr));
  }, [adminTestsData]);

  const filteredData = useMemo(() => {
    const list = adminTestsData?.data ?? ([] as AdminTestItem[]);
    return list.filter((item: AdminTestItem) => {
      // search
      if (
        filter.query &&
        !item.title.toLowerCase().includes(filter.query.toLowerCase())
      )
        return false;
      // course
      if (filter.course && item.course?.title !== filter.course) return false;
      // class
      if (
        filter.className &&
        !(item.course?.classes ?? []).some(
          (c) => c.className === filter.className,
        )
      )
        return false;
      // status
      if (filter.status && item.testState !== filter.status) return false;
      // start date equality (yyyy-mm-dd)
      if (filter.startDate && item.startTime) {
        const d = new Date(item.startTime).toISOString().slice(0, 10);
        if (d !== filter.startDate) return false;
      }
      return true;
    });
  }, [adminTestsData, filter]);

  const tableHeaders = [
    'Test Title',
    'Class',
    'Course',
    'Test Type',
    'Teacher',
    'Status',
    'Start Date',
  ];

  const getStatusVariant = (status: TestType['testState']) => {
    if (status === 'completed') return 'primary';
    if (status === 'scheduled') return 'warning';
    return 'success';
  };

  if (adminTestError) {
    errorLogger(adminTestError);
  }

  return (
    <section className='flex flex-col lg:flex-row gap-6 w-full'>
      <div className='flex-1 flex flex-col gap-4'>
        <div className='flex justify-between w-full'>
          <h1 className='text-2xl font-semibold'>Manage Tests</h1>
          <div>
            <Button
              onClick={() => setIsAddTestOpen(true)}
              label='+ Create Test'
            />
          </div>
        </div>

        <FilterBar
          courses={courses}
          classes={classes}
          onChange={(s) => setFilter(s)}
        />

        <div>
          <AppTable
            isLoading={isAdminTestLoading}
            headerColumns={tableHeaders}
            data={filteredData}
            itemKey={({ item }) => `${item.id}`}
            centralizeLabel={false}
            renderItem={({ item }) => {
              return (
                <>
                  <TableDataItem>{item.title}</TableDataItem>
                  <TableDataItem>
                    {(item.course?.classes ?? [])
                      .map((el) => el.className)
                      .join(', ')}
                  </TableDataItem>
                  <TableDataItem>{item.course?.title}</TableDataItem>
                  <TableDataItem>{item.type}</TableDataItem>
                  <TableDataItem>
                    {(item.course?.classes ?? [])
                      .map((el) => el.teacherId)
                      .join(', ')}
                  </TableDataItem>
                  <TableDataItem className='capitalize'>
                    <Badge
                      variant={getStatusVariant(
                        item.testState as TestType['testState'],
                      )}
                    >
                      {item.testState}
                    </Badge>
                  </TableDataItem>
                  <TableDataItem>
                    {item.startTime ? formatDate(item?.startTime) : '--'}
                  </TableDataItem>
                </>
              );
            }}
          />
        </div>
      </div>

      <aside className='w-full lg:w-80'>
        <TestSummary tests={adminTestsData?.data ?? []} />
      </aside>

      <Modal modalIsOpen={isAddTestOpen} setModalIsOpen={setIsAddTestOpen}>
        <AddTestForm />
      </Modal>
    </section>
  );
}
