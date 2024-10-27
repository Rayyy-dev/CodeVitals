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
  name: string;
  url: string;
  qualityScore: number;
  issuesCount: number;
  starsCount: number;
  language: string;
  metrics: {
    codeComplexity: number;
    codeDuplication: number;
    codeStyleConsistency: number;
    openIssuesAndPRs: number;
    dependencyManagement: number;
    documentationQuality: number;
    commitFrequency: number;
    branchingStrategy: number;
  };
  suggestions: string[];
}
