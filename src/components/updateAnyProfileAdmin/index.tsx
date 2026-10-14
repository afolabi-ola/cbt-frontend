import { useAdminUpdateAnyProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FiCamera, FiCheck, FiImage, FiX } from 'react-icons/fi';

interface UpdateAnyProfileFormValues {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  profilePicture: FileList;
}

interface UpdateAnyProfileInitialData {
  id: number;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
}

interface UpdateAnyProfileAdminProps {
  initialData?: UpdateAnyProfileInitialData;
  onClose?: () => void;
  //   onSubmit?: (data: UserProfile) => Promise<void>;
  //   isLoading?: boolean;
}

export default function UpdateAnyProfileAdmin({
  initialData = {
    id: 0,
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
  },
  onClose,
}: UpdateAnyProfileAdminProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAnyProfileFormValues>({
    defaultValues: {
      username: initialData.username ?? '',
      firstname: initialData.firstname ?? '',
      lastname: initialData.lastname ?? '',
      email: initialData.email ?? '',
      phoneNumber: initialData.phoneNumber ?? '',
    },
  });
  const selectedPicture = watch('profilePicture')?.[0];
  const [previewUrl, setPreviewUrl] = useState(
    initialData.profilePicture ?? '',
  );

  useEffect(() => {
    if (!selectedPicture) return;
    const objectUrl = URL.createObjectURL(selectedPicture);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPicture]);

  const {
    mutate: updateAnyProfile,
    isPending,
    isSuccess,
  } = useAdminUpdateAnyProfile(onClose);

  const onValidSubmit = async (data: UpdateAnyProfileFormValues) => {
    const {
      username,
      firstname,
      lastname,
      email,
      phoneNumber,
      profilePicture,
    } = data;

    updateAnyProfile({
      data: {
        username,
        firstname,
        lastname,
        email,
        phoneNumber,
        profilePicture: profilePicture?.[0],
      },
      userId: initialData.id,
    });
  };

  const isFormLoading = isPending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className='mx-auto w-full max-w-2xl'
    >
      <div className='mb-6 flex items-center justify-between border-b border-neutral-200 pb-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-primary-600'>
            Student profile
          </p>
          <h2 className='mt-1 text-2xl font-bold text-neutral-900'>
            Update details
          </h2>
          <p className='mt-1 text-sm text-neutral-500'>
            Keep the student account information current.
          </p>
        </div>
        <button
          type='button'
          onClick={onClose}
          className='rounded-full p-2 text-neutral-500 hover:bg-neutral-100'
          aria-label='Close modal'
        >
          <FiX size={20} />
        </button>
      </div>
      <div className='mb-6 flex flex-col items-center gap-3 rounded-xl bg-neutral-50 p-5 sm:flex-row'>
        <div className='relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-2xl font-bold text-primary-700 ring-4 ring-white'>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt='Student profile preview'
              className='h-full w-full object-cover'
            />
          ) : (
            `${initialData.firstname?.[0] ?? ''}${initialData.lastname?.[0] ?? ''}`.toUpperCase() || (
              <FiImage />
            )
          )}
        </div>
        <div className='text-center sm:text-left'>
          <label
            htmlFor='profilePicture'
            className='inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700'
          >
            <FiCamera /> Choose profile picture
          </label>
          <input
            id='profilePicture'
            type='file'
            accept='image/*'
            {...register('profilePicture')}
            disabled={isFormLoading}
            className='sr-only'
          />
          <p className='mt-2 text-xs text-neutral-500'>
            JPG, PNG or WEBP. Maximum size: 5 MB.
          </p>
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label htmlFor='username' className='block text-sm font-medium mb-1'>
            Username
          </label>
          <input
            id='username'
            type='text'
            {...register('username', {
              required: 'Username is required',
            })}
            disabled={isFormLoading}
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100'
          />
          {errors.username && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='firstname' className='block text-sm font-medium mb-1'>
            First Name
          </label>
          <input
            id='firstname'
            type='text'
            {...register('firstname', {
              required: 'First name is required',
            })}
            disabled={isFormLoading}
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100'
          />
          {errors.firstname && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='lastname' className='block text-sm font-medium mb-1'>
            Last Name
          </label>
          <input
            id='lastname'
            type='text'
            {...register('lastname', {
              required: 'Last name is required',
            })}
            disabled={isFormLoading}
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100'
          />
          {errors.lastname && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.lastname.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-1'>
            Email
          </label>
          <input
            id='email'
            type='email'
            {...register('email')}
            disabled={isFormLoading}
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100'
          />
        </div>

        <div>
          <label
            htmlFor='phoneNumber'
            className='block text-sm font-medium mb-1'
          >
            Phone Number
          </label>
          <input
            id='phoneNumber'
            type='tel'
            {...register('phoneNumber')}
            disabled={isFormLoading}
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-neutral-100'
          />
        </div>
      </div>
      <div className='mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5'>
        <button
          type='button'
          onClick={onClose}
          disabled={isFormLoading}
          className='rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isFormLoading}
          className='inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isFormLoading ? (
            'Updating...'
          ) : (
            <>
              <FiCheck /> Save changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
