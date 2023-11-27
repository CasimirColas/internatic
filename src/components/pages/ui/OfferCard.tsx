"use client";

import { Button } from "@/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";

import { Badge } from "@/components/shadcn/ui/badge";

import { Eye } from "lucide-react";

import { twMerge } from "tailwind-merge";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import OfferDetailedCard from "./OfferDetailedCard";
import { DetailedOfferReturn, getOffer } from "@/db/queries/getOffer";
import { useState } from "react";
import { FilteredOfferReturn } from "@/db/queries/getOffersFiltered";
import { OfferDetailedCardSkeleton } from "./Skeletons";

// type ChangePropertiesStartAt<T> = {
//   [P in keyof T]: P extends "startsAt" ? string : T[P];
// };
// type ChangePropertiesEndsAt<T> = {
//   [P in keyof T]: P extends "endsAt" ? string | null : T[P];
// };

// type Offer = ChangePropertiesStartAt<
//   ChangePropertiesEndsAt<FilteredOfferReturn>
// >;

type OfferCardFetch = {
  className?: string;
  detailsType: "fetch";
  data: FilteredOfferReturn;
};
type OfferCardRaw = {
  className?: string;
  detailsType: "raw";
  data: FilteredOfferReturn;
  details: DetailedOfferReturn;
};
type OfferCardVisual = {
  className?: string;
  detailsType: "visual";
  data: FilteredOfferReturn;
};

type OfferCardProps = OfferCardFetch | OfferCardRaw | OfferCardVisual;

function OfferCard(props: OfferCardProps) {
  const [fetchDetails, setfetchDetails] = useState<DetailedOfferReturn | null>(
    null
  );

  const detailsDialog = () => {
    if (props.detailsType === "fetch") {
      return fetchDetails ? (
        <OfferDetailedCard data={fetchDetails} intercation={true} />
      ) : (
        <OfferDetailedCardSkeleton />
      );
    }
    if (props.detailsType === "raw")
      return <OfferDetailedCard data={props.details} intercation={false} />;
    return null;
  };

  return (
    <Card
      className={twMerge(
        "flex flex-col justify-between relative ",
        props.className
      )}
    >
      <img
        src={props.data.pictureUrl}
        alt="Offer image"
        className="rounded-t-lg"
      />
      <div className="absolute flex items-center pt-2 pr-2 w-full justify-end">
        <p className="bg-black text-white p-2 rounded-lg">
          {props.data.isOffering ? "Job offer" : "Developper"} for{" "}
          {props.data.salary}$
        </p>
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between text-lg">
          <p>{props.data.title}</p>
        </CardTitle>
      </CardHeader>

      <CardContent className="h-full flex flex-col justify-center gap-1">
        <p>Type of contract: {props.data.type}</p>
        <p>
          Starting:{" "}
          {props.data.startsAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {props.data.endsAt ? (
          <p>
            Ending:{" "}
            {props.data.endsAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        ) : (
          <p>Permanent</p>
        )}
        <div>
          {props.data.tags.map((tag) => (
            <Badge key={tag.id} className="m-1">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full flex items-center gap-4"
              variant={"destructive"}
              onClick={async () => {
                if (props.detailsType === "fetch") {
                  const details = await getOffer(props.data.id);
                  setfetchDetails(details);
                }
              }}
            >
              Take a closer look <Eye size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="min-[430px]:max-w-[75vw] overflow-auto max-h-[95vh]">
            {detailsDialog()}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default OfferCard;
