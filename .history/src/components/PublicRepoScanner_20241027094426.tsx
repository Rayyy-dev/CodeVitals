import { useState } from 'react';
import { FiSearch, FiGithub, FiCode, FiUsers, FiAlertCircle, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Repository } from '@/types';

export default function PublicRepoScanner() {
  const [repoUrl, setRepoUrl] = useState('');
  const [scanResult, setScanResult] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL');
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
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleScan}
            className="space-y-4"
          >
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiGithub className="text-gray-400 mr-2" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter GitHub repository URL"
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
              >
                {isLoading ? 'Scanning...' : 'Scan'}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white shadow-lg rounded-lg p-6 space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">{scanResult.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FiCode className="text-gray-500" />
                <span className="text-gray-700">{scanResult.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiStar className="text-yellow-500" />
                <span className="text-gray-700">{scanResult.starsCount} stars</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiAlertCircle className="text-red-500" />
                <span className="text-gray-700">{scanResult.issuesCount} open issues</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiUsers className="text-blue-500" />
                <span className="text-gray-700">Public</span>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
              <p className="font-bold">Quality Score</p>
              <p className="text-3xl font-bold">{scanResult.quality_score}</p>
            </div>
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={resetScan}
                className="text-blue-600 hover:underline flex items-center"
              >
                ← Scan Another Repository
              </button>
              <button
                onClick={viewDetailedAnalysis}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View Detailed Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
