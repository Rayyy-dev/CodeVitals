import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user?: {
      image?: string;
    } & DefaultSession["user"];
  }
}

export interface Repository {
  complexFunction: any;
  duplicateArea: any;
  name: string;
  url: string;
  full_name: string;
  private: boolean;
  quality_score: number;
  qualityScore: number;
  issuesCount: number;
  starsCount: number;
  language: string;
  metrics: {
    codeComplexity: number;
    codeDuplication: number;
    codeStyleConsistency: number;
    testCoverage: number;
    openIssuesAndPRs: number;
    dependencyManagement: number;
    documentationQuality: number;
    commitFrequency: number;
    branchingStrategy: number;
  };
  suggestions: string[];
  topIssue: string;
  oldestPR: string;
}
