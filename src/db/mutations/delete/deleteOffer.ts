"use server";

import { getServerSession } from "next-auth";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type DeleteUserReturn = Exclude<
  Prisma.PromiseReturnType<typeof deleteOffer>,
  null
>;

export async function deleteOffer(id: string) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return {
      success: false,
      message: "You are not authenticated",
    };
  }
  const offer = await prisma.offer.findUnique({
    where: {
      id: id,
    },
  });
  if (!offer) {
    return {
      success: false,
      message: "Offer not found",
    };
  }
  if (offer.postedById !== session.user.id && session.user.type !== "admin") {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }

  const deletedOffer = await prisma.offer.delete({
    where: {
      id: id,
    },
  });

  return {
    success: true,
    data: deletedOffer,
  };
}
