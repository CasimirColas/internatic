"use client";

import {
  FilteredOfferArrayReturn,
  MainPageFilter,
  getOffersFiltered,
} from "@/db/queries/getOffersFiltered";
import OfferCard from "../ui/OfferCard";

import { useState, useEffect } from "react";

function OfferWrapper({ filter }: { filter: MainPageFilter }) {
  const [offers, setoffers] = useState<FilteredOfferArrayReturn>([]);

  useEffect(() => {
    getOffersFiltered(filter).then((e) => {
      setoffers(e);
    });
  }, [filter]);

  return (
    <div className="flex gap-4 flex-wrap justify-center xl:justify-start   xl:flex-nowrap xl:overflow-y-auto  w-screen p-6">
      {offers.map((e) => (
        <OfferCard
          key={e.id}
          detailsType="fetch"
          data={e}
          className="min-w-[350px] w-[350px] max-h-[570px]"
        />
      ))}
    </div>
  );
}

export default OfferWrapper;
