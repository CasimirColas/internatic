"use server";

import prisma from "@/db/prisma";

interface ApplyToOfferArgs {
  offerId: string;
  userId: string;
}

export async function applyToOffer(args: ApplyToOfferArgs) {
  const { offerId, userId } = args;
  const offer = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
    select: {
      id: true,
      postedById: true,
      interestedInIds: true,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  if (!offer) {
    return {
      success: false,
      message: "Offer not found",
    };
  }
  if (offer.interestedInIds.includes(userId)) {
    return {
      success: false,
      message: "You have already applied to this offer",
    };
  }
  if (offer.postedById === userId) {
    return {
      success: false,
      message: "You cannot apply to your own offer",
    };
  }
  const applyToOffer = await prisma.offer.update({
    where: {
      id: offerId,
    },
    data: {
      interestedIn: {
        connect: {
          id: userId,
        },
      },
    },
  });
  if (applyToOffer) {
    return {
      success: true,
      message: "The user has applied to the offer",
    };
  }
  return {
    success: false,
    message: "Something went wrong, the user could not apply to the offer",
  };
}
