"use server";

import { getServerSession } from "next-auth";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type UserAcceptedOffersReturn = Exclude<
  Prisma.PromiseReturnType<typeof getUserAcceptedOffers>,
  null
>;

export async function getUserAcceptedOffers(id: string) {
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
  const offers = await prisma.offer.findMany({
    where: {
      workingOnIds: {
        has: id,
      },
    },
  });
  return {
    success: true,
    data: offers,
  };
}
