import prisma from "@/db/prisma";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserType } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  type: UserType;
  profilePictureUrl: string | undefined;
}

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    // LinkedInProvider({
    //   clientId: process.env.LINKEDIN_CLIENT_ID as string,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    // }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "youremail@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Incomplete credentials");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          throw new Error("No user found");
        }

        // const passswordMatch = bcrypt.compare(credentials.password, user.password);

        if (user.password === credentials.password) {
          return user as SessionUser;
        }

        throw new Error("Incorrect password");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          fisrtName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          type: user.type,
          profilePictureUrl: user.profilePictureUrl,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          firstName: token.fisrtName,
          lastName: token.lastName,
          displayName: token.displayName,
          type: token.type,
          profilePictureUrl: token.profilePictureUrl,
        } as SessionUser,
      };
    },
  },
} satisfies NextAuthOptions;

export default NextAuth(authConfig);
