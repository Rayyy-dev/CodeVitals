import { Repository } from '@/types';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface RepositoryMetricsProps {
  repository: Repository;
}



import { useState } from 'react';
import { Repository } from '@/types';
import { motion } from 'framer-motion';

interface RepositoryMetricsProps {
  repository: Repository;
}

export default function RepositoryMetrics({ repository }: RepositoryMetricsProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const metrics = [
    { name: 'Code Complexity', value: repository.metrics.codeComplexity, color: 'bg-blue-500' },
    { name: 'Code Duplication', value: repository.metrics.codeDuplication, color: 'bg-green-500' },
    { name: 'Code Style Consistency', value: repository.metrics.codeStyleConsistency, color: 'bg-yellow-500' },
    { name: 'Test Coverage', value: repository.metrics.testCoverage, color: 'bg-purple-500' },
    { name: 'Open Issues and PRs', value: repository.metrics.openIssuesAndPRs, color: 'bg-red-500' },
    { name: 'Dependency Management', value: repository.metrics.dependencyManagement, color: 'bg-indigo-500' },
    { name: 'Documentation Quality', value: repository.metrics.documentationQuality, color: 'bg-pink-500' },
    { name: 'Commit Frequency', value: repository.metrics.commitFrequency, color: 'bg-teal-500' },
    { name: 'Branching Strategy', value: repository.metrics.branchingStrategy, color: 'bg-orange-500' },
  ];

  function getMetricDescription(key: string, value: number): string {
    switch (key) {
      case 'testCoverage':
        return `Current test coverage is at ${value}%, which is ${value >= 80 ? 'meeting' : 'below'} the recommended 80% threshold.`;
      case 'openIssuesAndPRs':
        return `There are currently ${100 - value} open issues and pending pull requests.`;
      // Add more cases for other metrics
      default:
        return `The current value for ${key} is ${value}.`;
    }
  }

  function getMetricRecommendations(key: string, value: number): string[] {
    switch (key) {
      case 'testCoverage':
        return [
          'Add unit tests for the UserProfile component',
          'Increase integration test coverage for the authentication flow',
          'Implement end-to-end tests for the main user journeys'
        ];
      case 'openIssuesAndPRs':
        return [
          'Prioritize and address the 3 high-priority bugs',
          'Review and merge the 2 oldest pull requests',
          'Assign team members to tackle the remaining open issues'
        ];
      // Add more cases for other metrics
      default:
        return ['Improve the score for this metric to enhance overall repository health.'];
    }
  }

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
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${metric.color} text-white`}>
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
      </div>
      <button
        onClick={() => setIsReportOpen(true)}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
      >
        Open Full Report
      </button>

      {isReportOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Full Report for {repository.name}</h2>
              <button
                onClick={() => setIsReportOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    value >= 80 ? 'bg-green-100 text-green-800' :
                    value >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {value}
                  </span>
                </h3>
                <p className="text-gray-600">
                  {getMetricDescription(key, value)}
                </p>
                <h4 className="font-semibold mt-2 mb-1">Recommendations:</h4>
                <ul className="list-disc list-inside">
                  {getMetricRecommendations(key, value).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getMetricDescription(key: string, value: number): string {
  switch (key) {
    case 'testCoverage':
      return `Current test coverage is at ${value}%, which is ${value >= 80 ? 'meeting' : 'below'} the recommended 80% threshold.`;
    case 'openIssuesAndPRs':
      return `There are currently ${100 - value} open issues and pending pull requests.`;
    // Add more cases for other metrics
    default:
      return `The current value for ${key} is ${value}.`;
  }
}

function getMetricRecommendations(key: string, value: number): string[] {
  switch (key) {
    case 'testCoverage':
      return [
        'Add unit tests for the UserProfile component',
        'Increase integration test coverage for the authentication flow',
        'Implement end-to-end tests for the main user journeys'
      ];
    case 'openIssuesAndPRs':
      return [
        'Prioritize and address the 3 high-priority bugs',
        'Review and merge the 2 oldest pull requests',
        'Assign team members to tackle the remaining open issues'
      ];
    // Add more cases for other metrics
    default:
      return ['Improve the score for this metric to enhance overall repository health.'];
  }
}
