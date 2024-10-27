import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  health_score: number;
}
