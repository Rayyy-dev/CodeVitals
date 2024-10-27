import { useState, useEffect } from 'react';
import { FiSearch, FiGithub, FiCode, FiUsers, FiAlertCircle, FiStar, FiExternalLink } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Repository } from '@/types';

export default function PublicRepoScanner() {
  const [repoUrl, setRepoUrl] = useState('');
  const [scanResult, setScanResult] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const githubUrlRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+\/?$/;
    setIsValidUrl(githubUrlRegex.test(repoUrl));
  }, [repoUrl]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    if (!isValidUrl) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/scan-public-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan repository');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setScanResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setRepoUrl('');
    setScanResult(null);
    setError('');
  };

  const viewDetailedAnalysis = () => {
    if (scanResult) {
      router.push(`/public-dashboard?repo=${encodeURIComponent(scanResult.url)}`);
    }
  };

  return (
    <motion.form
      key="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleScan}
      className="flex items-center w-full max-w-3xl mx-auto"
    >
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiGithub className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub repository URL"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !isValidUrl}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-full shadow-sm text-white ${
          isValidUrl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {isLoading ? 'Scanning...' : 'Scan'}
      </button>
      {(!isValidUrl && repoUrl) && (
        <p className="absolute mt-2 text-sm text-yellow-600">
          Please enter a valid GitHub repository URL
        </p>
      )}
      {error && <p className="absolute mt-2 text-sm text-red-500">{error}</p>}
    </motion.form>
  );
}
