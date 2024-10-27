import Image from 'next/image';
import { Session } from 'next-auth';

interface UserProfileProps {
  session: Session | null;
  repoCount: number;
}

export default function UserProfile({ session, repoCount }: UserProfileProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <div className="flex items-center">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="User avatar"
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || 'User'}</h1>
          <p className="text-gray-600">Full-stack developer | Open source enthusiast</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 9.172a4 4 0 115.656 5.656L10 14l-.828.828a4 4 0 115.656-5.656l.828-.828A6 6 0 1010 4v2a4 4 0 00-4.828 7.172L5.172 9.172z" clipRule="evenodd" />
          </svg>
          Public Repositories: {repoCount}
        </p>
      </div>
    </div>
  );
}

