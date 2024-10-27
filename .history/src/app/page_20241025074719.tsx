import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">GitHub Repository Health Checker</h1>
      <Link
        href="/api/auth/login"
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Login with GitHub
      </Link>
    </div>
  );
}
