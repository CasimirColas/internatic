"use server";

import { getServerSession } from "next-auth";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type DeleteTagReturn = Exclude<
  Prisma.PromiseReturnType<typeof createTag>,
  null
>;

export async function createTag(name: string) {
  const session = await getServerSession(authConfig);
  if (!session || session.user.type !== "admin") {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const tag = await prisma.tag.create({
    data: {
      name: name,
    },
  });

  return {
    success: true,
    data: tag,
  };
}
