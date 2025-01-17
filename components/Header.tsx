'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { TOKEN_KEY } from '../utils/client/storage';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '../providers/AuthProvider';
import { mutate } from 'swr';

const Header: React.FC = () => {
  const { isAuthorized, setIsAuthorized, isAdmin, setIsAdmin } =
    useContext(AuthContext);

  const router = useRouter();
  const pathname = usePathname();
  const isActive: (link: string) => boolean = (link: string) =>
    link === pathname;

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    router.push('/');
    setIsAuthorized(false);
    setIsAdmin(false);
    mutate(() => true);
  };

  return (
    <nav className="flex gap-4 py-4 px-8 bg-primary">
      <Link
        href="/posts"
        className={`text-lg hover:text-neutral-content ${isActive('/') ? 'text-neutral-content' : 'text-white'}`}
      >
        Blog
      </Link>
      {isAdmin && (
        <Link
          href="/new"
          className={`text-lg hover:text-neutral-content ${isActive('/new') ? 'text-neutral-content' : 'text-white'}`}
        >
          New
        </Link>
      )}
      {isAuthorized ? (
        <button
          className="text-lg text-white hover:text-neutral-content"
          onClick={handleLogout}
          data-testid="logout-button"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className={`text-lg hover:text-neutral-content ${isActive('/login') ? 'text-neutral-content' : 'text-white'}`}
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Header;
