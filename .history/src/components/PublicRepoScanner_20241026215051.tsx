import { useState } from 'react';
import { FiSearch, FiGithub, FiCode, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
  name: string;
  url: string;
  qualityScore: number;
  issuesCount: number;
  starsCount: number;
  language: string;
}

export default function PublicRepoScanner() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Replace this with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    setScanResult({
      name: 'example-repo',
      url: repoUrl,
      qualityScore: 85,
      issuesCount: 12,
      starsCount: 1500,
      language: 'TypeScript'
    });
    setIsLoading(false);
  };

  const resetScan = () => {
    setScanResult(null);
    setRepoUrl('');
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.form
            onSubmit={handleScan}
            className="flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <FiSearch className="mr-2" />
              )}
              {isLoading ? 'Scanning...' : 'Scan Repository'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{scanResult.name}</h3>
              <a href={scanResult.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                <FiGithub className="mr-1" /> View on GitHub
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{scanResult.qualityScore}</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600">{scanResult.issuesCount}</div>
                <div className="text-sm text-gray-600">Open Issues</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">{scanResult.starsCount}</div>
                <div className="text-sm text-gray-600">Stars</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-green-600">{scanResult.language}</div>
                <div className="text-sm text-gray-600">Main Language</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={resetScan}
                className="text-blue-600 hover:underline flex items-center"
              >
                ← Scan Another Repository
              </button>
              <button
                onClick={() => {/* TODO: Implement sign-in functionality */}}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Sign Up for Full Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
