"use server";

import prisma from "../prisma";

export async function getTags() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return tags;
}
