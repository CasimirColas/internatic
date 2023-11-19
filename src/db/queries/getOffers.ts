import { off } from "process";
import prisma from "../prisma";

export async function getOffers() {
  const offers = await prisma.offer.findMany({});
  return offers;
}
