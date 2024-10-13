'use client';

import React, { FormEvent, useContext, useState } from 'react';
import { TOKEN_KEY } from '../../utils/client/storage';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../providers/AuthProvider';
import { Input } from '../../components/form/Input';
import { ToastContext } from '../../providers/ToastProvider';
import { Loader } from '../../components/Loader';
import { useMutation } from '../../utils/client/api';
import { AuthResponse } from '../../types/auth';
import { getDecodedToken } from 'utils/client/auth';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuthorized, setIsAdmin } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const router = useRouter();

  const { trigger: triggerLogin } = useMutation('/api/auth');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    triggerLogin({
      method: 'POST',
      body: { name, password },
    })
      .then((data: AuthResponse) => {
        const decodedToken = getDecodedToken(data.token);
        const isAdmin =
          decodedToken &&
          'role' in decodedToken &&
          decodedToken.role === 'admin';

        localStorage.setItem(TOKEN_KEY, data.token);
        setIsAuthorized(true);
        setIsAdmin(isAdmin);

        router.replace(isAdmin ? '/posts' : '/');
      })
      .catch((_error) => {
        showToast("Couldn't log in", 'alert-error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-4">Login</h1>
      <form onSubmit={handleSubmit} className="grid gap-2 max-w-xs w-full">
        <Input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Name"
          id="login"
        />
        <Input
          type="password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          id="password"
        />
        <a href="/reset-password" className="link link-primary my-1 text-sm">
          Forgot your password?
        </a>
        <button
          type="submit"
          className="btn btn-sm btn-primary"
          disabled={isLoading}
          data-testid="login-submit"
        >
          {isLoading && <Loader />}
          Submit
        </button>
      </form>
    </>
  );
};

export default Login;
