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
          <h3 className="text-lg font-semibold">Quality Score</h3>
          <p className="text-3xl font-bold">{repository.quality_score.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Issues</h3>
          <ul className="list-disc pl-5">
            <li>Code Style: {repository.issues.code_style.toFixed(2)}</li>
            <li>Documentation: {repository.issues.documentation.toFixed(2)}</li>
            <li>Test Coverage: {repository.issues.test_coverage.toFixed(2)}</li>
            <li>Performance: {repository.issues.performance.toFixed(2)}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Suggestions</h3>
          <ul className="list-disc pl-5">
            {repository.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
