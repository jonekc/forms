'use client';

import React, { FormEvent, useContext, useState } from 'react';
import { TOKEN_KEY } from '../../utils/client/storage';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../providers/AuthProvider';
import { Input } from '../../components/form/Input';
import { ToastContext } from '../../providers/ToastProvider';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { setIsAuthorized } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Authentication failed');
        }
      })
      .then((data) => {
        localStorage.setItem(TOKEN_KEY, data.token);
        setIsAuthorized(true);
        router.replace('/posts');
      })
      .catch((_error) => {
        showToast("Couldn't log in", 'alert-error');
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
        />
        <Input
          type="password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <button type="submit" className="btn btn-sm btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default Login;
