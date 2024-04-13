'use client';

import React, { createContext, useEffect, useState } from 'react';
import { getUserToken } from '../utils/client/storage';

const AuthContext = createContext({
  isAuthorized: false,
  setIsAuthorized: (_value: boolean) => {},
});

const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(!!getUserToken());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
