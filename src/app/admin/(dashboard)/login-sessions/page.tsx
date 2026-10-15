'use client';

import Modal from '@/components/modal';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import SpinnerMini from '@/components/ui/SpinnerMini';
import axios from 'axios';
import ResultsFiltersBar, {
  ResultFilterField,
} from '@/features/results/components/ResultsFiltersBar';
import { authService } from '@/services/authService';
import type { LoginSession, LoginSessionsResponse } from '@/types/auth.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiEye, FiLogOut, FiRefreshCw, FiX } from 'react-icons/fi';
import { useServerPagination } from '@/hooks/useServerPagination';

const filterFields: ResultFilterField[] = [
  {
    type: 'search',
    name: 'search',
    label: 'Search active sessions',
    placeholder: 'Username, browser, device, IP, or login ID',
  },
];

type LogoutConfirmation =
  | { type: 'single'; session: LoginSession }
  | { type: 'all' }
  | null;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Unable to complete the request.';
  }

  return error instanceof Error
    ? error.message
    : 'Unable to complete the request.';
};

export default function LoginSessionsPage() {
  const queryClient = useQueryClient();
  const { params, goToPage, updateParams, setLimit } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });
  const [selectedSession, setSelectedSession] = useState<LoginSession | null>(
    null,
  );
  const [logoutConfirmation, setLogoutConfirmation] =
    useState<LogoutConfirmation>(null);

  const page = (params.page as number | undefined) ?? 1;
  const limit = (params.limit as number | undefined) ?? 10;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const sessionParams = { page, limit, search };

  const sessionsQuery = useQuery<LoginSessionsResponse>({
    queryKey: ['login-sessions', sessionParams],
    queryFn: () => authService.getLoginSessions(sessionParams),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logoutLoginSession,
    onSuccess: (response) => {
      toast.success(response.message || 'User login session terminated.');
      setSelectedSession(null);
      queryClient.invalidateQueries({ queryKey: ['login-sessions'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const logoutAllMutation = useMutation({
    mutationFn: authService.logoutAllLoginSessions,
    onSuccess: (response) => {
      toast.success(
        response.message || 'All active login sessions have been terminated.',
      );
      queryClient.invalidateQueries({ queryKey: ['login-sessions'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const sessionQuery = useMutation({
    mutationFn: authService.getLoginSession,
    onSuccess: (session) => setSelectedSession(session),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const sessions = sessionsQuery.data?.sessions ?? [];
  const isMutating = logoutMutation.isPending || logoutAllMutation.isPending;

  const handleLogoutAll = () => {
    if (sessions.length > 0) setLogoutConfirmation({ type: 'all' });
  };

  const handleLogout = (session: LoginSession) => {
    setLogoutConfirmation({ type: 'single', session });
  };

  const confirmLogout = () => {
    if (!logoutConfirmation) return;

    if (logoutConfirmation.type === 'all') {
      logoutAllMutation.mutate();
    } else {
      logoutMutation.mutate(logoutConfirmation.session.username);
    }

    setLogoutConfirmation(null);
  };

  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='w-full max-w-2xl space-y-1'>
          <p className='text-sm font-medium uppercase tracking-wider text-primary-600'>
            Security
          </p>
          <h1 className='mt-1 text-2xl font-semibold text-neutral-900'>
            Login Sessions
          </h1>
          <p className='mt-1 text-sm text-neutral-500'>
            Monitor and manage active user sessions across the platform.
          </p>
        </div>
        <div className='flex gap-2 w-1/2'>
          <Button
            onClick={() => sessionsQuery.refetch()}
            disabled={sessionsQuery.isFetching || isMutating}
          >
            <FiRefreshCw aria-hidden='true' className='mr-2' /> Refresh
          </Button>
          <Button
            variant='danger'
            onClick={handleLogoutAll}
            disabled={sessions.length === 0 || isMutating}
          >
            <FiLogOut aria-hidden='true' className='mr-2' /> Logout All
          </Button>
        </div>
      </div>

      <section className='overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm'>
        <div className='border-b border-neutral-200 px-4 py-4 sm:px-6'>
          <ResultsFiltersBar
            fields={filterFields}
            initialValues={{ search }}
            limit={limit}
            onChange={updateParams}
            onLimitChange={setLimit}
          />
        </div>
        <div className='flex items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-6'>
          <div>
            <h2 className='font-semibold text-neutral-900'>Active users</h2>
            <p className='text-sm text-neutral-500'>
              {sessionsQuery.data?.pagination.total ?? 0} active session
              {(sessionsQuery.data?.pagination.total ?? 0) === 1 ? '' : 's'}
            </p>
          </div>
          {sessionsQuery.isFetching && <SpinnerMini color='#0c4a6e' />}
        </div>

        {sessionsQuery.isLoading ? (
          <div className='flex min-h-56 items-center justify-center'>
            <SpinnerMini color='#0c4a6e' />
          </div>
        ) : sessionsQuery.isError ? (
          <div className='flex min-h-56 flex-col items-center justify-center gap-3 px-4 text-center'>
            <p className='text-sm text-error-700'>
              {getErrorMessage(sessionsQuery.error)}
            </p>
            <Button onClick={() => sessionsQuery.refetch()}>Try again</Button>
          </div>
        ) : sessions.length === 0 ? (
          <div className='flex min-h-56 items-center justify-center px-4 text-sm text-neutral-500'>
            No active login sessions found.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-primary-50 text-xs uppercase tracking-wide text-primary-800'>
                <tr>
                  <th className='px-6 py-3 font-semibold'>User</th>
                  <th className='px-6 py-3 font-semibold'>Device</th>
                  <th className='px-6 py-3 font-semibold'>IP address</th>
                  <th className='px-6 py-3 font-semibold'>Last activity</th>
                  <th className='px-6 py-3 text-right font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-100'>
                {sessions.map((session) => (
                  <tr key={session.loginId} className='hover:bg-neutral-50'>
                    <td className='px-6 py-4'>
                      <p className='font-medium text-neutral-900'>
                        {session.username}
                      </p>
                      <p className='mt-1 text-xs text-neutral-500'>
                        Logged in {formatDate(session.loginTime)}
                      </p>
                    </td>
                    <td className='px-6 py-4 text-neutral-700'>
                      {session.device} · {session.browser}
                    </td>
                    <td className='px-6 py-4 font-mono text-xs text-neutral-600'>
                      {session.ip}
                    </td>
                    <td className='px-6 py-4 text-neutral-600'>
                      {formatDate(session.lastActivity)}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => sessionQuery.mutate(session.username)}
                          disabled={sessionQuery.isPending}
                          className='inline-flex items-center gap-1 rounded-md border border-primary-200 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-50'
                        >
                          <FiEye aria-hidden='true' /> View
                        </button>
                        <button
                          type='button'
                          onClick={() => handleLogout(session)}
                          disabled={isMutating}
                          className='inline-flex items-center gap-1 rounded-md border border-error-200 px-3 py-2 text-xs font-semibold text-error-700 hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          <FiLogOut aria-hidden='true' /> Logout
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='border-t border-neutral-200 px-4 py-4 sm:px-6'>
              <Pagination
                page={sessionsQuery.data?.pagination.page ?? page}
                limit={sessionsQuery.data?.pagination.limit ?? limit}
                totalItems={sessionsQuery.data?.pagination.total ?? 0}
                totalPages={sessionsQuery.data?.pagination.pages ?? 1}
                onPageChange={goToPage}
                disabled={sessionsQuery.isFetching || isMutating}
                showPageSize={false}
                showPageInfo
              />
            </div>
          </div>
        )}
      </section>

      <Modal
        modalIsOpen={Boolean(logoutConfirmation)}
        setModalIsOpen={(isOpen) => {
          if (!isOpen || isMutating) setLogoutConfirmation(null);
        }}
      >
        {logoutConfirmation && (
          <div className='space-y-5'>
            <div>
              <p className='text-sm font-medium uppercase tracking-wider text-error-700'>
                Confirm action
              </p>
              <h2 className='mt-1 text-xl font-semibold text-neutral-900'>
                {logoutConfirmation.type === 'all'
                  ? 'Logout all sessions?'
                  : `Logout ${logoutConfirmation.session.username}?`}
              </h2>
              <p className='mt-2 text-sm text-neutral-600'>
                {logoutConfirmation.type === 'all'
                  ? 'Every active user session will be terminated immediately.'
                  : 'This user will be redirected to the login page immediately.'}
              </p>
            </div>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={() => setLogoutConfirmation(null)}
                disabled={isMutating}
                className='rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Cancel
              </button>
              <div>
                <Button
                  variant='danger'
                  onClick={confirmLogout}
                  disabled={isMutating}
                >
                  <FiLogOut aria-hidden='true' className='mr-2' /> Confirm
                  logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        modalIsOpen={Boolean(selectedSession)}
        setModalIsOpen={(isOpen) => {
          if (!isOpen) setSelectedSession(null);
        }}
      >
        {selectedSession && (
          <div className='space-y-5'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-medium uppercase tracking-wider text-primary-600'>
                  Session details
                </p>
                <h2 className='mt-1 text-xl font-semibold text-neutral-900'>
                  {selectedSession.username}
                </h2>
              </div>
              <button
                type='button'
                aria-label='Close session details'
                onClick={() => setSelectedSession(null)}
                className='rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
              >
                <FiX aria-hidden='true' size={20} />
              </button>
            </div>
            <dl className='grid gap-4 sm:grid-cols-2'>
              {[
                ['Login ID', selectedSession.loginId],
                ['Device', selectedSession.device],
                ['Browser', selectedSession.browser],
                ['IP address', selectedSession.ip],
                ['Login time', formatDate(selectedSession.loginTime)],
                ['Last activity', formatDate(selectedSession.lastActivity)],
              ].map(([label, value]) => (
                <div key={label} className='rounded-md bg-neutral-50 p-3'>
                  <dt className='text-xs font-medium uppercase tracking-wide text-neutral-500'>
                    {label}
                  </dt>
                  <dd className='mt-1 break-all text-sm text-neutral-900'>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className='flex justify-end'>
              <Button
                variant='danger'
                onClick={() => {
                  handleLogout(selectedSession);
                }}
                disabled={isMutating}
              >
                <FiLogOut aria-hidden='true' className='mr-2' /> Logout session
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
