import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Code Vitals Dashboard</h1>
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <FiHome className="mr-2" />
          Back to Home
        </Link>
      </div>
    </header>
  );
}
