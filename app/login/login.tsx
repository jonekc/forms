'use client';

import React, { useState } from 'react';
import { TOKEN_KEY } from '../../utils/client/storage';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        router.replace('/posts');
      })
      .catch((_error) => {});
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            type="text"
            id="name"
            name="name"
            required
            onInput={(e) => {
              setName((e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            required
            onInput={(e) => {
              setPassword((e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Login;
