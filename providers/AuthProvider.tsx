'use client';

import React, { createContext, useEffect, useState } from 'react';
import { getUserToken } from '../utils/client/storage';
import { getDecodedToken } from 'utils/client/auth';

const AuthContext = createContext({
  isAuthorized: false,
  setIsAuthorized: (_value: boolean) => {},
  isAdmin: false,
  setIsAdmin: (_value: boolean) => {},
});

const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getUserToken();
    const decodedToken = getDecodedToken(token || '');
    const isAdmin =
      !!decodedToken && 'role' in decodedToken && decodedToken.role === 'admin';
    setIsAuthorized(!!token);
    setIsAdmin(isAdmin);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthorized, setIsAuthorized, isAdmin, setIsAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
