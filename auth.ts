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
    expiresAt: number;
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

// Helper to decode JWT and get expiry
function getTokenExpiry(accessToken: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64").toString()
    );
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return 0;
  }
}

// Refresh token if it expires in less than 5 minutes
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in ms

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
      // Initial sign in - store all data
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: Date.now() + user.expiresIn * 1000,
          email: user.email,
          name: user.name,
        };
      }
      // Return existing token - refresh happens in session callback
      return token;
    },
    async session({ session, token }) {
      const now = Date.now();
      let currentToken = token.accessToken;
      let currentRefreshToken = token.refreshToken;
      let expiresAt = token.expiresAt;

      // Check if API access token needs refresh
      // (expired or expiring within threshold)
      if (expiresAt - now < REFRESH_THRESHOLD) {
        console.log("[Auth] Token expired, attempting refresh...");

        try {
          const response = await apiRefreshToken(currentRefreshToken);

          if (response.status === 0 && response.data) {
            // Refresh successful
            console.log("[Auth] Token refresh successful");
            currentToken = response.data.accessToken;
            currentRefreshToken = response.data.refreshToken;
            expiresAt = Date.now() + response.data.expiresIn * 1000;

            // Update the JWT token for next time
            token.accessToken = currentToken;
            token.refreshToken = currentRefreshToken;
            token.expiresAt = expiresAt;
          } else {
            // Refresh failed - API returned error
            console.log("[Auth] Token refresh failed:", response);
            return {
              ...session,
              error: "RefreshAccessTokenError",
              accessToken: "",
              expiresAt: 0,
            };
          }
        } catch (error: any) {
          // Refresh failed - exception
          console.log("[Auth] Token refresh exception:", error?.message || error);
          return {
            ...session,
            error: "RefreshAccessTokenError",
            accessToken: "",
            expiresAt: 0,
          };
        }
      }

      // Return valid session with current tokens
      session.accessToken = currentToken;
      session.refreshToken = currentRefreshToken;
      session.expiresAt = expiresAt;
      session.user.email = token.email;
      session.user.name = token.name;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
