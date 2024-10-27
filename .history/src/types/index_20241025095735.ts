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
  health_score: number;
  // Add more properties as needed, for example:
  // stars: number;
  // forks: number;
  // open_issues: number;
  // last_updated: string;
}
