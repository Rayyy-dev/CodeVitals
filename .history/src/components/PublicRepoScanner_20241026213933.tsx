import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function PublicRepoScanner() {
  const [repoUrl, setRepoUrl] = useState('');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the scanning functionality
    console.log('Scanning repository:', repoUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Try It Now: Scan a Public Repository</h2>
      <p className="text-gray-600 mb-6">Enter a public GitHub repository URL to get a quick analysis.</p>
      <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
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
        >
          <FiSearch className="mr-2" />
          Scan Repository
        </button>
      </form>
    </motion.div>
  );
}
