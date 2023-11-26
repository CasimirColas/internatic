"use server";

import { OfferType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export interface MainPageFilter {
  isOffering?: boolean;
  from?: Date;
  to?: Date;
  type?: OfferType;
  rating?: number;
  title?: string;
  team?: boolean;
  salaryDown?: number;
  salaryUp?: number;
  tags?: string[];
}

export type FilteredOfferArrayReturn = Exclude<
  Prisma.PromiseReturnType<typeof getOffersFiltered>,
  null
>;

export type FilteredOfferReturn = FilteredOfferArrayReturn[number];

const select = {
  id: true,
  title: true,
  pictureUrl: true,
  salary: true,
  startsAt: true,
  endsAt: true,
  type: true,
  isOffering: true,
  tags: {
    select: {
      id: true,
      name: true,
    },
  },
};

export async function getOffersFiltered(args?: MainPageFilter) {
  const session = await getServerSession(authConfig);
  // for simulating delay
  // await new Promise((r) => setTimeout(r, 3000));
  if (!args) {
    return await prisma.offer.findMany({
      select: select,
      where: {
        status: "on",
        isOffering: true,
        interestedIn: session?.user?.id
          ? {
              none: {
                id: session?.user?.id,
              },
            }
          : undefined,
      },
    });
  }
  const offers = await prisma.offer.findMany({
    select: select,
    where: {
      status: "on",
      isOffering: args.isOffering ?? true,
      interestedIn: session?.user?.id
        ? {
            none: {
              id: session?.user?.id,
            },
          }
        : undefined,
      type: args.type,
      postedBy: {
        rating: {
          gte: args.rating,
        },
      },
      title: {
        contains: args.title,
        mode: "insensitive",
      },
      positions: {
        equals: !args.team ? 1 : undefined,
        gte: args.team ? 2 : undefined,
      },
      salary: {
        gte: args.salaryDown,
        lte: args.salaryUp,
      },
      startsAt: {
        gte: args.from,
        lte: args.to,
      },
      endsAt: {
        gte: args.from,
        lte: args.to,
      },
      tags:
        args.tags?.length === 0
          ? undefined
          : {
              some: {
                name: {
                  in: args.tags,
                },
              },
            },
    },
  });
  return offers;
}
