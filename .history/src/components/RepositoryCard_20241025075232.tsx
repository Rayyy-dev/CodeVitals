interface Repository {
  id: number;
  name: string;
  full_name: string;
  health_score: number;
}

interface RepositoryCardProps {
  repository: Repository;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{repository.name}</h2>
      <p className="text-gray-600 mb-4">{repository.full_name}</p>
      <div className="flex items-center">
        <span className="text-lg font-medium mr-2">Health Score:</span>
        <span className={`text-lg font-bold ${
          repository.health_score >= 80 ? 'text-green-500' : 
          repository.health_score >= 60 ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {repository.health_score}
        </span>
      </div>
    </div>
  );
}
