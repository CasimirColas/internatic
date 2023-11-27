"use server";

import { getServerSession } from "next-auth";
import prisma from "@/db/prisma";
import { OfferStatus, OfferType, Prisma } from "@prisma/client";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export type UpdateOfferReturn = Exclude<
  Prisma.PromiseReturnType<typeof getUpdateOffer>,
  null
>;

export interface UpdateOfferArgs {
  title?: string;
  description?: string;
  pictureUrl?: string;
  positions?: number;
  salary?: number;
  startsAt?: Date;
  endsAt?: Date;
  type?: OfferType;
  status?: OfferStatus;
  tags?: string[];
}

export async function getUpdateOffer(id: string, args: UpdateOfferArgs) {
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

  // Data checks

  if (args.startsAt && args.endsAt && args.startsAt > args.endsAt) {
    return {
      success: false,
      message: "Start date cannot be after end date",
    };
  }
  if (args.positions && args.positions < 1) {
    return {
      success: false,
      message: "Positions must be a positive number",
    };
  }
  if (args.salary && args.salary < 0) {
    return {
      success: false,
      message: "Salary must be a positive number",
    };
  }
  if (args.description && args.description.length > 400) {
    return {
      success: false,
      message: "Description must be less than 400 characters",
    };
  }
  if (args.title && args.title.length > 30) {
    return {
      success: false,
      message: "Title must be less than 400 characters",
    };
  }
  if (args.positions && args.positions < offer.workingOnIds.length) {
    args.positions = offer.workingOnIds.length;
    args.status = OfferStatus.full;
  }

  const updatedOffer = await prisma.offer.update({
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
    message: "Successfully updated offer",
    fields: Object.keys(args),
    data: updatedOffer,
  };
}
