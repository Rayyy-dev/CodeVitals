import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Missing GITHUB_ID or GITHUB_SECRET environment variable");
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
