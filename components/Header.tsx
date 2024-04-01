import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TOKEN_KEY, getUserToken } from '../utils/client/storage';

const Header: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

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
        <Link href="/posts">
          <a className="bold" data-active={isActive('/posts')}>
            Posts
          </a>
        </Link>
      )}
      <Link href="/">
        <a className="bold" data-active={isActive('/')}>
          New
        </a>
      </Link>
      {isAuthorized ? (
        <span className="bold" onClick={handleLogout}>
          Logout
        </span>
      ) : (
        <Link href="/login">
          <a className="bold" data-active={isActive('/login')}>
            Login
          </a>
        </Link>
      )}
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }

        a:hover {
          color: #555555;
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

export default Header;
