'use client';

import { signOut, useSession } from 'next-auth/react';

export default function LogoutButton() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-gray-600 hover:text-gray-800 flex items-center"
    >
      <span className="mr-2">Logout</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

