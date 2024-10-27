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
  private: boolean;
  url: string;
  issuesCount: number;
  starsCount: number;
  language: string;
  // Add any other properties that are used in your application
}
