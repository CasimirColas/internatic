"use server";

import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export type DetailedOfferReturn = Exclude<
  Prisma.PromiseReturnType<typeof getOffer>,
  null
>;

export async function getOffer(id: string) {
  const offer = await prisma.offer.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      pictureUrl: true,
      positions: true,
      salary: true,
      startsAt: true,
      endsAt: true,
      type: true,
      isOffering: true,
      postedById: true,
      _count: {
        select: {
          interestedIn: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      postedBy: {
        select: {
          birthday: true,
          displayName: true,
          type: true,
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          rating: true,
          profilePictureUrl: true,
          bio: true,
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return offer;
}
