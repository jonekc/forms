'use client';

import React, { FormEvent, useContext, useState } from 'react';
import { Input } from '../../components/form/Input';
import { ToastContext } from '../../providers/ToastProvider';
import { Loader } from '../../components/Loader';
import { useMutation } from '../../utils/client/api';
import { useSearchParams, useRouter } from 'next/navigation';

const SetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);

  const { showToast } = useContext(ToastContext);

  const { trigger: updatePassword, isMutating } = useMutation(
    '/api/users/set-password',
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === confirmPassword) {
      updatePassword({
        method: 'PATCH',
        body: { email, token, password },
      })
        .then(() => {
          showToast(
            `Password successfully change, you can now login with your new password`,
            'alert-success',
          );
          router.push('/login');
        })
        .catch((_error) => {
          showToast(
            "Couldn't set a new password, token may be expired or invalid",
            'alert-error',
          );
        });
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-4">Set new password</h1>
      <form onSubmit={handleSubmit} className="grid gap-2 max-w-xs w-full">
        <Input
          required
          value={password}
          type="password"
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            setError(confirmPassword !== value);
          }}
          placeholder="Password"
        />
        <Input
          required
          value={confirmPassword}
          type="password"
          onChange={(e) => {
            const value = e.target.value;
            setConfirmPassword(value);
            setError(password !== value);
          }}
          placeholder="Confirm password"
        />
        {error && <p className="text-sm text-error">Passwords do not match</p>}
        <button
          type="submit"
          className="btn btn-sm btn-primary"
          disabled={isMutating}
        >
          {isMutating && <Loader />}
          Submit
        </button>
      </form>
    </>
  );
};

export default SetPassword;
