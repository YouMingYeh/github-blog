import GithubProvider from "next-auth/providers/github";
import { type AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: { scope: "public_repo" },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account && account.access_token) {
        // set access_token to the token payload
        token.accessToken = account.access_token;
      }

      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },
    session: async ({ session, token }) => {
      return { ...session, token: token.accessToken };
    },
  },
};

import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
import { type NextAuthOptions, getServerSession } from "next-auth";

export function auth( // <-- use this function to access the jwt from React components
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
