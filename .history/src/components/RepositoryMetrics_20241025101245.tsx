import { Repository } from '@/types';

interface RepositoryMetricsProps {
  repository: Repository;
}

export default function RepositoryMetrics({ repository }: RepositoryMetricsProps) {
  const metrics = [
    { name: 'Code Complexity', value: repository.metrics.codeComplexity, color: 'bg-yellow-400' },
    { name: 'Code Duplication', value: repository.metrics.codeDuplication, color: 'bg-yellow-400' },
    { name: 'Code Style Consistency', value: repository.metrics.codeStyleConsistency, color: 'bg-green-400' },
    { name: 'Test Coverage', value: repository.metrics.testCoverage, color: 'bg-red-400' },
    { name: 'Open Issues and PRs', value: repository.metrics.openIssuesAndPRs, color: 'bg-yellow-400' },
    { name: 'Dependency Management', value: repository.metrics.dependencyManagement, color: 'bg-yellow-400' },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Overall Health</h2>
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray={`${repository.quality_score}, 100`}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
            {repository.quality_score}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{metric.name}</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${metric.color}`}>
                {metric.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${metric.color}`}
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
        <ul className="list-disc pl-5">
          {repository.suggestions.map((suggestion, index) => (
            <li key={index} className="mb-2">{suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
