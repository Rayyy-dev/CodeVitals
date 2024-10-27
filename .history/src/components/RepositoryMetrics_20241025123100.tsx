import { Repository } from '@/types';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiCopy, FiCheck, FiFileText, FiGitPullRequest, FiShield } from 'react-icons/fi';

interface RepositoryMetricsProps {
  repository: Repository;
}

export default function RepositoryMetrics({ repository }: RepositoryMetricsProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const metrics = [
    { name: 'Code Complexity', value: repository.metrics.codeComplexity, color: 'bg-teal-500' },
    { name: 'Code Duplication', value: repository.metrics.codeDuplication, color: 'bg-blue-500' },
    { name: 'Code Style Consistency', value: repository.metrics.codeStyleConsistency, color: 'bg-indigo-500' },
    { name: 'Test Coverage', value: repository.metrics.testCoverage, color: 'bg-purple-500' },
    { name: 'Open Issues and PRs', value: repository.metrics.openIssuesAndPRs, color: 'bg-pink-500' },
    { name: 'Dependency Management', value: repository.metrics.dependencyManagement, color: 'bg-red-500' },
    { name: 'Documentation Quality', value: repository.metrics.documentationQuality, color: 'bg-orange-500' },
    { name: 'Commit Frequency', value: repository.metrics.commitFrequency, color: 'bg-yellow-500' },
    { name: 'Branching Strategy', value: repository.metrics.branchingStrategy, color: 'bg-green-500' },
  ];

  function getColorClass(value: number): string {
    if (value >= 80) return 'bg-green-400';
    if (value >= 70) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  function getMetricDescription(key: string, value: number): string {
    switch (key) {
      case 'testcoverage':
        return `Your test coverage is currently at ${value}%, which is ${value >= 80 ? 'meeting' : 'below'} the recommended 80% threshold. ${value < 80 ? 'There\'s room for improvement to ensure better code reliability.' : 'Great job on maintaining high test coverage!'}`;
      case 'openissuesandprs':
        return `You have ${100 - value} open issues and pending pull requests. ${value < 70 ? 'Consider addressing these to improve your project\'s health.' : 'You\'re doing well in managing your issues and PRs!'}`;
      case 'codecomplexity':
        return `Your code complexity score is ${value}. ${value < 70 ? 'There might be opportunities to simplify some parts of your codebase.' : 'Your code is maintaining a good level of simplicity.'}`;
      case 'codedduplication':
        return `Your code duplication score is ${value}. ${value < 80 ? 'There might be some repeated code that could be refactored.' : 'You\'re doing a great job keeping code duplication to a minimum!'}`;
      default:
        return `The current value for ${key} is ${value}. ${value < 70 ? 'There might be room for improvement in this area.' : 'You\'re doing well in this aspect!'}`;
    }
  }

  function getMetricRecommendations(key: string, value: number): string[] {
    switch (key) {
      case 'testcoverage':
        return [
          `Focus on adding tests for the ${repository.name} component to increase coverage`,
          'Implement integration tests for the newly added features',
          'Consider setting up automated test runs in your CI/CD pipeline'
        ];
      case 'openissuesandprs':
        return [
          `Prioritize the issue "${repository.topIssue}" as it's been open for a while`,
          `Review and provide feedback on the PR "${repository.oldestPR}"`,
          'Set up a weekly team meeting to go through open issues and PRs'
        ];
      case 'codecomplexity':
        return [
          `Refactor the ${repository.complexFunction} function to reduce its cyclomatic complexity`,
          'Consider breaking down large classes or modules into smaller, more manageable pieces',
          'Implement design patterns to simplify complex logic where appropriate'
        ];
      case 'codedduplication':
        return [
          `Extract common logic in ${repository.duplicateArea} into a shared utility function`,
          'Use inheritance or composition to reduce duplicated code in similar classes',
          'Set up a linter rule to catch and prevent code duplication in future commits'
        ];
      default:
        return [
          `Review and improve the ${key} aspect of your codebase`,
          'Discuss best practices for this metric with your team',
          'Set up monitoring and alerts for this metric to track improvements over time'
        ];
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <metric.icon className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              </div>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${getColorClass(metric.value)} text-white`}>
                {metric.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getColorClass(metric.value)}`}
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
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsReportOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          View Full Report
        </button>
      </div>

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
            {metrics.map((metric) => (
              <div key={metric.name} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  {metric.name}
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${metric.color} text-white`}>
                    {metric.value}
                  </span>
                </h3>
                <p className="text-gray-600">
                  {getMetricDescription(metric.name.toLowerCase().replace(/\s+/g, ''), metric.value)}
                </p>
                <h4 className="font-semibold mt-2 mb-1">Recommendations:</h4>
                <ul className="list-disc list-inside">
                  {getMetricRecommendations(metric.name.toLowerCase().replace(/\s+/g, ''), metric.value).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
