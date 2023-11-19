import prisma from "@/db/prisma";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserType } from "@prisma/client";

export interface SessionUser {
  id: string;
  type: UserType;
  profilePictureUrl: string | undefined;
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
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
          console.log("No credentials provided");
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          console.log("No user found");
          return null;
        }

        // const passswordMatch = bcrypt.compare(credentials.password, user.password);

        if (user.password === credentials.password) {
          return user as SessionUser;
        }

        console.log("Password does not match");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          type: user.type,
          profilePictureUrl: user.profilePictureUrl,
        };
      }

      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          type: token.type,
          profilePictureUrl: token.profilePictureUrl,
        },
      };
    },
  },
} satisfies NextAuthOptions;

export default NextAuth(authConfig);
