"use client";

import { DetailedOfferReturn } from "@/db/queries/getOffer";
import ProfileCard from "../user/ui/ProfileCard";
import { differenceInBusinessDays } from "date-fns";
import { ArrowBigRight, ArrowBigDown, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/shadcn/ui/badge";
import { Button } from "@/components/shadcn/ui/button";
import { useSession } from "next-auth/react";
import functionalPopup from "./functionalPopup";
import Link from "next/link";
import { applyToOffer } from "@/db/mutations/update/applyToOffer";

export interface OfferDetailedCardProps {
  data: DetailedOfferReturn;
  intercation: boolean;
}

function OfferDetailedCard({ data, intercation }: OfferDetailedCardProps) {
  const user = data.postedBy;
  const profileCardData = { ...user, tags: user.tags.map((tag) => tag.name) };
  const session = useSession();

  async function handleApply() {
    if (session.status === "authenticated" && session.data.user) {
      const res = await applyToOffer({
        offerId: data.id,
        userId: session.data.user.id,
      });
      console.log(res);
    } else {
      functionalPopup(
        <div className="flex w-full items-center justify-center gap-6">
          <AlertTriangle size={48} className="text-red-500" />
          <div className="flex flex-col gap-1 justify-center">
            <b>You must login to apply to an offer</b>

            <p>
              If you do not have an account yet you can <b>register</b> by
              clicking{" "}
              <Link href={"/register"} className="underline">
                here
              </Link>{" "}
              or <b>login</b> by clicking{" "}
              <Link href={"/login"} className="underline">
                here
              </Link>
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="h-full w-full flex gap-4 lg:flex-row flex-col">
      <div className="lg:w-1/2 w-full flex flex-col items-center gap-2 h-full justify-start">
        <div
          className="relative bg-cover w-full flex justify-center rounded-lg text-card-foreground shadow-sm"
          style={{
            backgroundImage: `url(${data.pictureUrl})`,
          }}
        >
          <img
            src={data.pictureUrl}
            alt="Offer image"
            className="max-h-[22rem] z-1 xl:z-10  rounded-lg"
          />
          <div className="absolute inset-0 bg-white bg-opacity-40 hidden xl:flex" />
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-4  justify-start">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Job description:
          </h3>
          <p>
            {data.description} Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Quisque eu tincidunt dui. Donec vehicula malesuada
            nibh rutrum vehicula. Curabitur tempus urna eget commodo varius.
            Cras nec neque auctor, luctus metus at, lacinia lectus. Praesent
            dolor tellus, mattis ut nisl sit amet, hendrerit maximus turpis.
            Vestibulum ac euismod risus, ac ultrices risus.
          </p>
          <div className="flex flex-wrap gap-2">
            <b>Tags:</b>
            <div>
              {data.tags.map((tag) => (
                <Badge key={tag.id} className="m-1">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex flex-col items-left gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Posted by:
          </h3>
          <ProfileCard data={profileCardData} />
        </div>

        <div className="flex items-center gap-2 justify-center rounded-lg border bg-card text-card-foreground shadow-sm w-full p-2 flex-col sm:flex-row">
          <p>Starting:</p>

          <b>
            {data.startsAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </b>

          {data.endsAt ? (
            <>
              <ArrowBigRight size={24} className="hidden sm:flex" />
              <ArrowBigDown size={24} className="flex sm:hidden" />
              <b>
                {data.endsAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </b>
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 bg-slate-100 p-4 border-l-2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight underline">
            {data.title}
          </h3>
          <div className="flex sm:items-center gap-2 flex-col sm:flex-row items-start">
            <p>
              <b>Paid: {data.salary}$</b>
            </p>
            {data.endsAt ? (
              <p>
                over{" "}
                <b>
                  {differenceInBusinessDays(data.endsAt, data.startsAt)}{" "}
                  business days
                </b>
              </p>
            ) : (
              <p>per month of employement</p>
            )}
          </div>

          <p>
            <b>Type of contract:</b> {data.type}
          </p>
          <p>
            <b>Available positions:</b>{" "}
            {data.positions - data._count.interestedIn}/{data.positions}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <p className="p-2 bg-black rounded lg text-center text-white w-full">
            {data._count.interestedIn} people are currently interested in this
            offer.
          </p>
          <Button
            variant={"destructive"}
            onClick={() => {
              if (intercation) {
                handleApply();
              }
            }}
          >
            Apply now !
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OfferDetailedCard;
