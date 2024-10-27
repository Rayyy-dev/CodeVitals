import Image from 'next/image';
import { Session } from 'next-auth';
import { Repository } from '@/types';

interface UserProfileProps {
  session: Session | null;
  repositories: Repository[];
}

export default function UserProfile({ session, repositories }: UserProfileProps) {
  const publicRepoCount = repositories.filter(repo => !repo.private).length;
  const privateRepoCount = repositories.filter(repo => repo.private).length;

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
      <div className="mt-4 flex space-x-4">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 9.172a4 4 0 115.656 5.656L10 14l-.828.828a4 4 0 115.656-5.656l.828-.828A6 6 0 1010 4v2a4 4 0 00-4.828 7.172L5.172 9.172z" clipRule="evenodd" />
          </svg>
          Public Repositories: {publicRepoCount}
        </p>
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Private Repositories: {privateRepoCount}
        </p>
      </div>
    </div>
  );
}
