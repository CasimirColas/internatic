"use server";

import { OfferType, Prisma } from "@prisma/client";
import prisma from "@/db/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/pages/api/auth/[...nextauth]";

export interface CreateOfferArgs {
  title: string;
  description: string;
  salary: number;
  pictureUrl: string;
  type: OfferType;
  positions: number;
  startsAt: Date;
  endsAt?: Date;
  status: "on" | "off";
  tags: string[];
}

export async function createOffer(args: CreateOfferArgs) {
  const session = await getServerSession(authConfig);
  if (!session) {
    return {
      success: false,
      message: "You are not authenticated",
    };
  }
  if (args.positions < 1) {
    args.positions = 1;
  }
  if (args.salary < 1) {
    return {
      success: false,
      message: "Salary must be greater than 0",
    };
  }

  const offer = await prisma.offer.create({
    data: {
      ...args,
      postedBy: {
        connect: {
          id: session.user.id,
        },
      },
      isOffering: session.user.type === "company",
      tags: {
        connect: args.tags.map((tag) => ({ name: tag })),
      },
      type: !args.endsAt ? "open" : args.type,
    },
  });
}
