"use server";

import { getServerSession } from "next-auth";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type UpdateUserReturn = Exclude<
  Prisma.PromiseReturnType<typeof getUpdateUser>,
  null
>;

export interface UpdateUserArgs {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthday?: Date;
  displayName?: string;
  password?: string;
  profilePictureUrl?: string;
  bio?: string;
  tags?: string[];
}

export async function getUpdateUser(id: string, args: UpdateUserArgs) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return {
      success: false,
      message: "You are not authenticated",
    };
  }
  if (session.user.id !== id && session.user.type !== "admin") {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...args,
      tags: args.tags
        ? {
            connect: args.tags.map((tag) => ({
              name: tag,
            })),
          }
        : undefined,
    },
  });

  return {
    success: true,
    message: "Successfully updated the user",
    fields: Object.keys(args),
    data: updatedUser,
  };
}
