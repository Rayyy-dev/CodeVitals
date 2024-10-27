import { Repository } from '@/types';

interface RepositoryCardProps {
  repository: Repository;
  onClick: () => void;
  isSelected: boolean;
}

export default function RepositoryCard({ repository, onClick, isSelected }: RepositoryCardProps) {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 cursor-pointer transition-colors ${
        isSelected ? 'border-2 border-blue-500' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold mb-2">{repository.name}</h2>
      <p className="text-gray-600 mb-4">{repository.full_name}</p>
      <div className="flex items-center">
        <span className="text-lg font-medium mr-2">Repository Health:</span>
        <span className={`text-lg font-bold ${
          repository.quality_score >= 80 ? 'text-green-500' : 
          repository.quality_score >= 60 ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {repository.quality_score.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
