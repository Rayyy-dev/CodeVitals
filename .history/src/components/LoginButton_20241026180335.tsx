'use client';

import { signIn } from 'next-auth/react';
import { FiGithub } from 'react-icons/fi';

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn('github')}
      className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <FiGithub className="mr-2 h-5 w-5" />
      Login with GitHub
    </button>
  );
}
