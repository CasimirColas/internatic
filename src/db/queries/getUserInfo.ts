"use server";

import { getServerSession } from "next-auth";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type UserInfoReturn = Exclude<
  Prisma.PromiseReturnType<typeof getUserInfo>,
  null
>;

export async function getUserInfo(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return {
      success: false,
      message: "You are not authenticated",
    };
  }
  if (session.user.id !== id || session.user.type !== "admin") {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return {
    success: true,
    data: user,
  };
}
