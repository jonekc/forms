'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import Link from 'next/link';
import { TOKEN_KEY, getUserToken } from '../utils/client/storage';
import { usePathname, useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isActive: (link: string) => boolean = (link: string) =>
    link === pathname;

  useEffect(() => {
    setIsAuthorized(!!getUserToken());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push('/');
    setIsAuthorized(!!getUserToken());
  };

  let left = (
    <div className="left">
      {isAuthorized && (
        <Link href="/posts" style={linkStyles(isActive('/posts'))}>
          Posts
        </Link>
      )}
      <Link
        href="/"
        style={{ ...linkStyles(isActive('/')), marginLeft: '1rem' }}
      >
        New
      </Link>
      {isAuthorized ? (
        <span className="bold" onClick={handleLogout}>
          Logout
        </span>
      ) : (
        <Link href="/login" style={linkStyles(isActive('/login'))}>
          Login
        </Link>
      )}
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        span {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

const linkStyles: (isActive: boolean) => CSSProperties = (isActive) => ({
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  color: isActive ? 'gray' : '#000',
  // '&:hover': { color: '#555555' },
});

export default Header;
