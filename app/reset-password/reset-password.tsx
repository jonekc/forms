'use client';

import React, { FormEvent, useContext, useState } from 'react';
import { Input } from '../../components/form/Input';
import { ToastContext } from '../../providers/ToastProvider';
import { Loader } from '../../components/Loader';
import { useMutation } from '../../utils/client/api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useContext(ToastContext);

  const { trigger: triggerResetPassword } = useMutation(
    '/api/users/reset-password',
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    triggerResetPassword({
      method: 'POST',
      body: { email },
    })
      .then(() => {
        showToast(
          `Password reset link has been sent to ${email}`,
          'alert-success',
        );
        setEmail('');
      })
      .catch((_error) => {
        showToast("Couldn't send a password reset email", 'alert-error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-4">Reset password</h1>
      <form onSubmit={handleSubmit} className="grid gap-2 max-w-xs w-full">
        <Input
          required
          value={email}
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
        />
        <button
          type="submit"
          className="btn btn-sm btn-primary"
          disabled={isLoading}
        >
          {isLoading && <Loader />}
          Submit
        </button>
      </form>
    </>
  );
};

export default ResetPassword;
