"use server";

import { getServerSession } from "next-auth";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type DeleteUserReturn = Exclude<
  Prisma.PromiseReturnType<typeof deleteUser>,
  null
>;

export async function deleteUser(id: string) {
  const session = await getServerSession(authConfig);
  if (!session || (session.user.id !== id && session.user.type !== "admin")) {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return {
    success: true,
    data: user,
  };
}
