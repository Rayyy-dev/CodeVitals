import { useState } from 'react';
import { Repository } from '@/types';

interface RepositorySelectorProps {
  repositories: Repository[];
}

export default function RepositorySelector({ repositories }: RepositorySelectorProps) {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  return (
    <div>
      <p className="mb-2">Select a Repository to Analyze</p>
      <select
        className="w-full p-2 border border-gray-300 rounded-md"
        onChange={(e) => {
          const repo = repositories.find(r => r.id === parseInt(e.target.value));
          setSelectedRepo(repo || null);
        }}
      >
        <option value="">Choose a repository</option>
        {repositories.map((repo) => (
          <option key={repo.id} value={repo.id}>
            {repo.name}
          </option>
        ))}
      </select>
      {selectedRepo && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">{selectedRepo.name}</h3>
          <p>Health Score: {selectedRepo.healthScore}</p>
          {/* Add more repository details here */}
        </div>
  );
}

