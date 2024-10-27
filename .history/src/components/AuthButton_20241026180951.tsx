'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { FiGithub, FiLogOut } from 'react-icons/fi';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-gray-600 hover:text-gray-800 flex items-center"
      >
        <span className="mr-2">Logout</span>
        <FiLogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300"
    >
      <FiGithub className="mr-2 h-5 w-5" />
      Login with GitHub
    </button>
  );
}
