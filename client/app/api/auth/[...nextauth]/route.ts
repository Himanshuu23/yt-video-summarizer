import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    backendToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
}

// Server-side URL for the API (inside Docker this can differ from the browser-facing NEXT_PUBLIC_API_URL).
const INTERNAL_API_URL = (
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000"
).trim();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          prompt: "select_account consent",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // match the backend token lifetime (7d)
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;

        // Runs on the Next.js server right after a verified OAuth login:
        // create/find the user and get a backend token. INTERNAL_API_SECRET never reaches the browser.
        try {
          const res = await fetch(`${INTERNAL_API_URL}/api/user/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
            },
            body: JSON.stringify({ email: token.email, name: token.name }),
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            token.backendToken = data.accessToken;
          } else {
            console.error("[nextauth] backend sync failed:", res.status);
          }
        } catch (err) {
          console.error("[nextauth] backend sync error:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.accessToken = token.accessToken as string;
      session.backendToken = token.backendToken as string | undefined;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
