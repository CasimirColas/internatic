"use server";

import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export type TagsReturn = Exclude<
  Prisma.PromiseReturnType<typeof getTags>,
  null
>;

export async function getTags() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return tags;
}
