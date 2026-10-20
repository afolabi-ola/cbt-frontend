'use client';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaBook, FaHome, FaArrowRight } from 'react-icons/fa';
import { useEffect } from 'react';
import { useTestStore } from '@/store/useTestStore';
import { useTestResultStore } from '@/store/useTestResultStore';
import { useTestAttemptStore } from '@/store/useTestAttemptStore';
import Modal from '@/components/modal';

function getEndReasonMessage(reason: string) {
  switch (reason.toLowerCase()) {
    case 'timeout':
      return 'Your test ended because the allotted time expired.';
    case 'admin_ended_session':
      return 'Your test session was ended by an administrator.';
    default:
      return reason.replaceAll('_', ' ');
  }
}

export default function EndedTestPage() {
  const router = useRouter();
  // const { testResult } = useTestResult();
  const { testResult } = useTestResultStore();
  const endReason = useTestResultStore((s) => s.endReason);
  const clearEndReason = useTestResultStore((s) => s.clearEndReason);
  const { selectedTest } = useTestStore();
  const resetAttempt = useTestAttemptStore((s) => s.reset);

  // Redirect if no test result (user accessed directly without submitting)
  useEffect(() => {
    if (!testResult || !selectedTest) {
      router.push('/tests');
    }
    // If we have a testResult (meaning user just finished), clear the
    // in-progress test attempt state so a subsequent attempt doesn't reuse
    // stale data.
    if (testResult) {
      resetAttempt();
    }
  }, [testResult, router, selectedTest, resetAttempt]);

  if (!testResult || !selectedTest) {
    return null;
  }

  const endReasonModal = endReason ? (
    <Modal
      modalIsOpen={true}
      setModalIsOpen={(isOpen) => {
        if (!isOpen) clearEndReason();
      }}
    >
      <div className='space-y-4 text-center'>
        <h2 className='text-xl font-semibold text-neutral-900'>Test ended</h2>
        <p className='text-sm text-neutral-600'>
          {getEndReasonMessage(endReason)}
        </p>
        <button
          type='button'
          onClick={clearEndReason}
          className='w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700'
        >
          Continue
        </button>
      </div>
    </Modal>
  ) : null;

  const handleGoToTests = () => {
    router.push('/tests');
  };

  if (testResult.test?.type ?? false) {
    const { test, score, totalMarks } = testResult;
    const totalQuestions = selectedTest.totalQuestions;
    const testType = test?.type.toLowerCase() as 'test' | 'exam' | 'practice';

    const handleGoToCorrections = () => {
      router.push('/corrections');
    };

    return (
      <>
        {endReasonModal}
        <div className='min-h-screen bg-linear-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4'>
          <div className='max-w-2xl w-full'>
            {/* Success Icon */}
            <div className='flex justify-center mb-8 animate-bounce'>
              <div className='relative'>
                <div className='absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse'></div>
                <FaCheckCircle className='w-24 h-24 text-green-500 relative' />
              </div>
            </div>

            {/* Main Card */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6 border border-gray-100'>
              {/* Header */}
              <div className='text-center space-y-3'>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 capitalize'>
                  {test?.type.toLowerCase()} Completed!
                </h1>
                <p className='text-lg text-gray-600'>
                  Great job! You&apos;ve successfully submitted{' '}
                  <span className='font-semibold text-primary-700'>
                    {test?.title || ''}
                  </span>
                </p>
              </div>

              {/* Score Display (if available) */}
              {score !== undefined && totalMarks !== undefined && (
                <div className='bg-linear-to-r from-primary-50 to-primary-100 rounded-2xl p-6 text-center'>
                  <p className='text-sm text-gray-600 mb-2'>Your Score</p>
                  <p className='text-5xl font-bold text-primary-700'>
                    {score}
                    <span className='text-2xl text-gray-500'>
                      /{totalMarks}
                    </span>
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-gray-500'>
                    What&apos;s next?
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-3'>
                {testType === 'practice' && (
                  <button
                    onClick={handleGoToCorrections}
                    className='w-full flex items-center justify-between bg-linear-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group'
                  >
                    <div className='flex items-center gap-3'>
                      <FaBook className='w-5 h-5' />
                      <span className='font-semibold text-lg'>
                        View Corrections
                      </span>
                    </div>
                    <FaArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </button>
                )}

                <button
                  onClick={handleGoToTests}
                  className={`w-full flex items-center justify-between ${
                    testType === 'practice'
                      ? 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                      : 'bg-linear-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl'
                  } px-6 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 group`}
                >
                  <div className='flex items-center gap-3'>
                    <FaHome className='w-5 h-5' />
                    <span className='font-semibold text-lg'>Back to Tests</span>
                  </div>
                  <FaArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </button>
              </div>

              {/* Info Message */}
              <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6'>
                <p className='text-sm text-blue-800 text-center'>
                  {testType === 'exam' || testType === 'test' ? (
                    <>
                      📝 Your {testType} results will be available soon. Check
                      back later for detailed feedback.
                    </>
                  ) : (
                    <>
                      💡 Review your answers and learn from corrections to
                      improve your performance.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <p className='text-center text-gray-500 text-sm mt-6'>
              Keep up the great work! 💪
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {endReasonModal}
      <div className='min-h-screen bg-linear-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4'>
        <div className='max-w-2xl w-full'>
          {/* Success Icon */}
          <div className='flex justify-center mb-8 animate-bounce'>
            <div className='relative'>
              <div className='absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse'></div>
              <FaCheckCircle className='w-24 h-24 text-green-500 relative' />
            </div>
          </div>

          {/* Main Card */}
          <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6 border border-gray-100'>
            {/* Header */}
            <div className='text-center space-y-3'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 capitalize'>
                {selectedTest.type.toLowerCase()} Completed!
              </h1>
              <p className='text-lg text-gray-600'>
                Great job! You&apos;ve successfully submitted{' '}
                <span className='font-semibold text-primary-700'>
                  {selectedTest?.title}
                </span>
              </p>
            </div>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500'>
                  What&apos;s next?
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              <button
                onClick={handleGoToTests}
                className={`w-full flex items-center justify-between 
                bg-linear-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl
               px-6 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 group`}
              >
                <div className='flex items-center gap-3'>
                  <FaHome className='w-5 h-5' />
                  <span className='font-semibold text-lg'>Back to Tests</span>
                </div>
                <FaArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </button>
            </div>

            {/* Info Message */}
            <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6'>
              <p className='text-sm text-blue-800 text-center'>
                📝 Your {selectedTest.type.toLowerCase()} results will be
                available soon. Check back later for detailed feedback.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className='text-center text-gray-500 text-sm mt-6'>
            Keep up the great work! 💪
          </p>
        </div>
      </div>
    </>
  );
}
