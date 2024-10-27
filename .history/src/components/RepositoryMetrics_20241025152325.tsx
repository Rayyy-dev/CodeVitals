import { Repository } from '../types';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiCopy, FiCheck, FiFileText, FiGitPullRequest, FiShield, FiBook, FiGitCommit, FiGitBranch } from 'react-icons/fi';

interface RepositoryMetricsProps {
  repository: Repository;
}

export default function RepositoryMetrics({ repository }: RepositoryMetricsProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (repository.size === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{repository.name}</h2>
        <p className="text-gray-600 mb-4">This repository is empty.</p>
        <div className="bg-gray-100 rounded-lg p-4">
          <p>🚀 Start by adding a README.md file to describe your project and its purpose.</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { name: 'Code Complexity', value: repository.metrics.codeComplexity, color: 'bg-teal-500', icon: FiCode },
    { name: 'Code Duplication', value: repository.metrics.codeDuplication, color: 'bg-blue-500', icon: FiCopy },
    { name: 'Code Style Consistency', value: repository.metrics.codeStyleConsistency, color: 'bg-indigo-500', icon: FiCheck },
    { name: 'Test Coverage', value: repository.metrics.testCoverage, color: 'bg-purple-500', icon: FiFileText },
    { name: 'Open Issues and PRs', value: repository.metrics.openIssuesAndPRs, color: 'bg-pink-500', icon: FiGitPullRequest },
    { name: 'Dependency Management', value: repository.metrics.dependencyManagement, color: 'bg-red-500', icon: FiShield },
    { name: 'Documentation Quality', value: repository.metrics.documentationQuality, color: 'bg-orange-500', icon: FiBook },
    { name: 'Commit Frequency', value: repository.metrics.commitFrequency, color: 'bg-yellow-500', icon: FiGitCommit },
    { name: 'Branching Strategy', value: repository.metrics.branchingStrategy, color: 'bg-green-500', icon: FiGitBranch },
  ];

  function getMetricDescription(key: string, value: number): string {
    switch (key) {
      case 'testcoverage':
        if (value === 100) {
          return 'Test coverage is not applicable for this repository, likely due to its small size or documentation-focused nature.';
        }
        return `Your test coverage is currently at ${value}%, which is ${value >= 70 ? 'meeting' : 'below'} the recommended 70% threshold. ${value < 70 ? 'There\'s room for improvement to ensure better code reliability.' : 'Great job on maintaining test coverage!'}`;
      case 'openissuesandprs':
        return `You have ${100 - value} open issues and pending pull requests. ${value < 70 ? 'Consider addressing these to improve your project\'s health.' : 'You\'re doing well in managing your issues and PRs!'}`;
      case 'codecomplexity':
        return `Your code complexity score is ${value}. ${value < 70 ? 'There might be opportunities to simplify some parts of your codebase.' : 'Your code is maintaining a good level of simplicity.'}`;
      case 'codeduplication':
        return `Your code duplication score is ${value}. ${value < 80 ? 'There might be some repeated code that could be refactored.' : 'You\'re doing a great job keeping code duplication to a minimum!'}`;
      default:
        return `The current value for ${key} is ${value}. ${value < 70 ? 'There might be room for improvement in this area.' : 'You\'re doing well in this aspect!'}`;
    }
  }

  function getMetricRecommendations(key: string, value: number, repo: Repository): string[] {
    switch (key) {
      case 'testcoverage':
        if (value === 100) {
          return ['Your repository doesn\'t require traditional test coverage. Consider adding documentation tests or examples to showcase proper usage.'];
        }
        return [
          `Increase test coverage for ${repo.name}. Start by adding tests for critical components and functions.`,
          `Set up a CI/CD pipeline to automatically run tests on each commit.`,
          `Consider using test-driven development (TDD) for new features.`
        ];
      case 'openissuesandprs':
        return [
          `Address the top issue: "${repo.topIssue}"`,
          `Review and provide feedback on the oldest PR: "${repo.oldestPR}"`,
          `Set up a weekly triage session to manage open issues and PRs.`
        ];
      case 'codecomplexity':
        return [
          `Review and refactor complex areas of your codebase, particularly in ${repo.complexFunction}.`,
          `Consider breaking down large functions or classes into smaller, more manageable pieces.`,
          `Use static analysis tools to identify and track complex code over time.`
        ];
      case 'codeduplication':
        return [
          `Address code duplication, particularly in ${repo.duplicateArea}.`,
          `Create shared utilities or base classes to reduce repeated code.`,
          `Set up linter rules to catch and prevent code duplication in future commits.`
        ];
      case 'documentationquality':
        return [
          `Improve documentation for ${repo.name}, focusing on key components and functions.`,
          `Add or update the README.md file with clear instructions on how to set up and use the project.`,
          `Consider using tools like JSDoc or TypeDoc to generate API documentation automatically.`
        ];
      case 'dependencymanagement':
        return [
          `Review and update outdated dependencies in ${repo.name}.`,
          `Set up automated dependency updates using tools like Dependabot or Renovate.`,
          `Regularly audit your dependencies for security vulnerabilities.`
        ];
      case 'commitfrequency':
        return [
          `Aim for more frequent, smaller commits in ${repo.name} to improve code review processes.`,
          `Encourage team members to commit their work daily, even if features are not complete.`,
          `Use feature flags to allow for continuous integration of work-in-progress features.`
        ];
      case 'branchingstrategy':
        return [
          `Implement a clear branching strategy for ${repo.name}, such as GitFlow or GitHub Flow.`,
          `Use protected branches to enforce code review and CI/CD processes.`,
          `Regularly clean up and delete merged feature branches.`
        ];
      default:
        return [
          `Review and improve the ${key} aspect of your ${repo.name} repository.`,
          `Discuss best practices for ${key} with your team and establish guidelines.`,
          `Set up monitoring and alerts for ${key} to track improvements over time.`
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <metric.icon className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
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
          {repository.personalizedSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start mb-3 last:mb-0">
              <svg className="w-6 h-6 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
            className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Detailed Report for {repository.name}</h2>
              <button
                onClick={() => setIsReportOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Repository Overview</h3>
              <p>Full Name: {repository.full_name}</p>
              <p>Overall Health Score: {repository.quality_score}</p>
              <p>Top Issue: {repository.topIssue}</p>
              <p>Oldest PR: {repository.oldestPR}</p>
            </div>
            {metrics.map((metric) => (
              <div key={metric.name} className="mb-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <metric.icon className="w-5 h-5 mr-2" />
                  {metric.name}
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${metric.color} text-white`}>
                    {metric.value}
                  </span>
                </h3>
                <p className="text-gray-600 mb-2">
                  {getMetricDescription(metric.name.toLowerCase().replace(/\s+/g, ''), metric.value)}
                </p>
                <h4 className="font-semibold mt-2 mb-1">Personalized Recommendations:</h4>
                <ul className="list-disc list-inside">
                  {getMetricRecommendations(metric.name.toLowerCase().replace(/\s+/g, ''), metric.value, repository).map((rec, index) => (
                    <li key={index} className="ml-4">{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">Next Steps</h3>
              <p>Based on the analysis of {repository.name}, we recommend focusing on the following areas:</p>
              <ol className="list-decimal list-inside mt-2">
                {repository.suggestions.map((suggestion, index) => (
                  <li key={index} className="ml-4 mb-2">{suggestion}</li>
                ))}
              </ol>
            </div>
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">Personalized Suggestions</h3>
              <p>Based on a detailed analysis of your repository, we recommend:</p>
              <ul className="list-disc list-inside mt-2">
                {repository.personalizedSuggestions.map((suggestion, index) => (
                  <li key={index} className="ml-4 mb-2">{suggestion}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
