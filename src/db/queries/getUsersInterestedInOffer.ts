"use server";

import { getServerSession } from "next-auth";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type InterestedUsersInOfferReturn = Exclude<
  Prisma.PromiseReturnType<typeof getInterestedUsersInOffer>,
  null
>;

export async function getInterestedUsersInOffer(id: string) {
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
  const users = await prisma.user.findMany({
    where: {
      interestedInIds: {
        has: id,
      },
    },
  });

  return {
    success: true,
    data: users,
  };
}
