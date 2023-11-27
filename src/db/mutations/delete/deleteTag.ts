"use server";

import { getServerSession } from "next-auth";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type DeleteTagReturn = Exclude<
  Prisma.PromiseReturnType<typeof deleteTag>,
  null
>;

export async function deleteTag(name: string) {
  const session = await getServerSession(authConfig);
  if (!session || session.user.type !== "admin") {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const tag = await prisma.tag.delete({
    where: {
      name: name,
    },
  });

  return {
    success: true,
    data: tag,
  };
}
