import { Repository } from '@/types';

interface RepositoryMetricsProps {
  repository: Repository;
}

export default function RepositoryMetrics({ repository }: RepositoryMetricsProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{repository.name} Metrics</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Health Score</h3>
          <p className="text-3xl font-bold">{repository.health_score}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Full Name</h3>
          <p>{repository.full_name}</p>
        </div>
        {/* Add more metrics here as needed */}
      </div>
    </div>
  );
}
