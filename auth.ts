import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { apiLogin, apiRefreshToken } from "./lib/api";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    email: string;
    name: string;
  }

  interface Session {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: {
      email: string;
      name: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    email: string;
    name: string;
    error?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await apiLogin(
            credentials.email as string,
            credentials.password as string
          );

          if (response.status === 0 && response.data) {
            // Decode JWT to get user info
            const tokenPayload = JSON.parse(
              Buffer.from(response.data.accessToken.split(".")[1], "base64").toString()
            );

            return {
              id: tokenPayload.sub,
              email: tokenPayload.email,
              name: tokenPayload.name,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              expiresIn: response.data.expiresIn,
            };
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = Date.now() + user.expiresIn * 1000;
        token.email = user.email;
        token.name = user.name;
        return token;
      }

      // Return previous token if it hasn't expired yet (with 60 second buffer)
      if (Date.now() < token.expiresAt - 60 * 1000) {
        return token;
      }

      // Token has expired, try to refresh it
      try {
        const response = await apiRefreshToken(token.refreshToken);

        if (response.status === 0 && response.data) {
          return {
            ...token,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            expiresAt: Date.now() + response.data.expiresIn * 1000,
          };
        }

        // Failed to refresh - return token as expired
        return { ...token, error: "RefreshAccessTokenError" };
      } catch {
        // Refresh failed - return token as expired
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.email = token.email;
      session.user.name = token.name;

      // Pass through error if token refresh failed
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
