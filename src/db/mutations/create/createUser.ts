"use server";

import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

export async function createUser(data: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data: data,
  });
  return user;
}
