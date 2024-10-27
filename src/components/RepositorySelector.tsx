import { useState } from 'react';
import { Repository } from '../types';
import RepositoryMetrics from './RepositoryMetrics';

interface RepositorySelectorProps {
  repositories: Repository[];
}

export default function RepositorySelector({ repositories }: RepositorySelectorProps) {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempSelectedRepo, setTempSelectedRepo] = useState<Repository | null>(null);

  const handleRepoSelect = (repo: Repository | null) => {
    if (repo) {
      setTempSelectedRepo(repo);
      setShowConfirmation(true);
    } else {
      setSelectedRepo(null);
    }
  };

  const handleConfirm = () => {
    setSelectedRepo(tempSelectedRepo);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setTempSelectedRepo(null);
    setShowConfirmation(false);
  };

  return (
    <div>
      <p className="mb-2">Select a Repository to Analyze</p>
      <select
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        onChange={(e) => {
          const repo = repositories.find(r => r.id === parseInt(e.target.value));
          handleRepoSelect(repo || null);
        }}
      >
        <option value="">Choose a repository</option>
        {repositories.map((repo) => (
          <option key={repo.id} value={repo.id}>
            {repo.name}
          </option>
        ))}
      </select>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Do you want to scan and analyze {tempSelectedRepo?.name}?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={handleCancel} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
      {selectedRepo && <RepositoryMetrics repository={selectedRepo} />}
    </div>
  );
}
