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
  id: number;
  name: string;
  full_name: string;
  quality_score: number;
  issues: {
    code_style: number;
    documentation: number;
    test_coverage: number;
    performance: number;
  };
  suggestions: string[];
}
