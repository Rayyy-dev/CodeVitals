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
    { name: 'Documentation Quality', value: repository.metrics.documentationQuality, color: 'bg-blue-400' },
    { name: 'Commit Frequency', value: repository.metrics.commitFrequency, color: 'bg-purple-400' },
    { name: 'Branching Strategy', value: repository.metrics.branchingStrategy, color: 'bg-indigo-400' },
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
      <div className="grid grid-cols-2 gap-4 mb-6">
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
        <div className="bg-gray-100 rounded-lg p-4">
          {repository.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start mb-3 last:mb-0">
              <svg className="w-6 h-6 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p>{suggestion}</p>
            </div>
          ))}
        </div>
        <div className="text-right mt-2">
          <a href="#" className="text-blue-500 hover:underline">View Full Report →</a>
        </div>
      </div>
    </div>
  );
}
